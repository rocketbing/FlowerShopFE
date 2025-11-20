import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useEffect, useState } from "react";
import { getUserInfoAsync, updateUserInfoAsync, editAddressAsync, deleteAddressAsync } from "../store/auth";
import { Button, Modal, Form, Input, Select, Checkbox, Row, Col, message } from "antd";

const { Option } = Select;

// 加拿大13个省
const canadianProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon"
];

export default function Addresses() {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingAddress, setEditingAddress] = useState(null); // 用于跟踪正在编辑的地址类型和索引
    const [shippingAddressArray, setShippingAddressArray] = useState([]);
    
    useEffect(() => {
        dispatch(getUserInfoAsync());
    }, [dispatch]);
    
    const { user, loading } = useAppSelector((state) => state.auth);
    const username = user?.username || user?.name || user?.data?.username || user?.data?.name || "";
    const homeAddress = user?.data?.homeAddress;
    const shippingAddress = user?.data?.shippingAddress;
    const navigate = useNavigate();
    
    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
        setEditingAddress(null);
    };
    
    const handleEdit = (address, addressType = "homeAddress", id = null) => {
        setEditingAddress({ address, addressType, id });
        setIsEditModalOpen(true);
        // 设置表单默认值
        editForm.setFieldsValue({
            firstName: address.firstName || "",
            lastName: address.lastName || "",
            street: address.street || "",
            city: address.city || "",
            country: address.country || "Canada",
            state: address.state || "",
            zipCode: address.zipCode || "",
            phoneNumber: address.phoneNumber || ""
        });
    };
    
    const handleDelete = (addressType = "homeAddress", id = null) => {
        Modal.confirm({
            title: "Delete Address",
            content: "Are you sure you want to delete this address?",
            okText: "Yes",
            cancelText: "No",
            onOk: async () => {
                try {
                    if (addressType === "homeAddress") {
                        await dispatch(updateUserInfoAsync({ homeAddress: null })).unwrap();
                        message.success("Home address deleted successfully");
                        await dispatch(getUserInfoAsync()).unwrap();
                    } else if (addressType === "shippingAddress" && id !== null) {
                        await dispatch(deleteAddressAsync(id)).unwrap();
                        message.success("Shipping address deleted successfully");
                        await dispatch(getUserInfoAsync()).unwrap();
                    }
                } catch (error) {
                    message.error(error || "Failed to delete address");
                }
            },
        });
    };
    
    const onEditFinish = async (values) => {
        if (!editingAddress) return;
        
        const { addressType, id } = editingAddress;

        
        try {
            if (addressType === "homeAddress") {
                await dispatch(updateUserInfoAsync({ homeAddress: values })).unwrap();
                message.success("Home address updated successfully");
                await dispatch(getUserInfoAsync()).unwrap();
            } else if (addressType === "shippingAddress" && id !== null && values) {
                await dispatch(editAddressAsync({ id, address: values })).unwrap();
                message.success("Shipping address updated successfully");
                await dispatch(getUserInfoAsync()).unwrap();
            }
            setIsEditModalOpen(false);
            editForm.resetFields();
            setEditingAddress(null);
        } catch (error) {
            message.error(error || "Failed to update address");
        }
    };
    
    const onFinish = async (values) => {

        const { setAsHomeAddress, ...restValues } = values;

        
        if(setAsHomeAddress) {
            dispatch(updateUserInfoAsync({ homeAddress: restValues }));
        } else {
            setShippingAddressArray([...shippingAddressArray, restValues]);
            dispatch(updateUserInfoAsync({ shippingAddress: shippingAddressArray }));
        }
        setIsModalOpen(false);
        form.resetFields();
    };
    
    return (
        <div style={{ width: "70%", margin: "0 auto", borderRadius: "10px", padding: "20px" }}>
            <h1>Addresses</h1>
            <span className="a_link_underline" onClick={() => navigate("/account")}>Return to Account Details</span>
            <div style={{ margin: "50px 0" }}>
                <span 
                    style={{ 
                        font: "18px Baskerville, serif", 
                        backgroundColor: "#1A1B18", 
                        borderRadius: "5px", 
                        color: "#ffffff", 
                        padding: "10px 30px", 
                        cursor: "pointer" 
                    }} 
                    onClick={showModal}
                >
                    ADD A NEW ADDRESS
                </span>
            </div>
            
            <Modal
                title={<span>ADD A NEW ADDRESS</span>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                   
                                name="firstName"
                                rules={[{ required: true, message: "Please enter your first name" }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                     
                                name="lastName"
                                rules={[{ required: true, message: "Please enter your last name" }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item
                     
                        name="street"
                        rules={[{ required: true, message: "Please enter your address" }]}
                    >
                        <Input placeholder="Address" />
                    </Form.Item>
                    
                    <Form.Item
                   
                        name="city"
                        rules={[{ required: true, message: "Please enter your city" }]}
                    >
                        <Input placeholder="City" />
                    </Form.Item>
                    
                    <Form.Item
                     
                        name="country"
                        rules={[{ required: true, message: "Please select a country" }]}
                    >
                        <Select placeholder="Select Country">
                            <Option value="Canada">Canada</Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                 
                        name="state"
                        rules={[{ required: true, message: "Please select a province" }]}
                    >
                        <Select placeholder="Select Province">
                            {canadianProvinces.map((province) => (
                                <Option key={province} value={province}>
                                    {province}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                   
                        name="zipCode"
                        rules={[{ required: true, message: "Please enter your postal/ZIP code" }]}
                    >
                        <Input placeholder="Postal/ZIP Code" />
                    </Form.Item>
                    
                    <Form.Item
                     
                        name="phoneNumber"
                        rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                        <Input placeholder="Phone" />
                    </Form.Item>
                    
                    <Form.Item name="setAsHomeAddress" valuePropName="checked">
                        <Checkbox>Set as home address</Checkbox>
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="default" htmlType="submit" style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif", marginRight: "10px" }}>
                            Submit
                        </Button>
                        <Button type="default" onClick={handleCancel} style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif" }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {loading ? (
                <div className="address_card mx-auto text-center">
                    <div>
                        <h2>Loading...</h2>
                    </div>
                </div>
            ) : homeAddress && homeAddress.street ? (
                <div className="address_card mx-auto text-center mb-5">
                    <div>
                        <h2>Home Address</h2>
                        <p>{homeAddress.firstName} {homeAddress.lastName}</p>
                        <p>{homeAddress.street}</p>
                        <p>{homeAddress.city} {homeAddress.state} {homeAddress.zipCode}</p>
                        <p className="mb-3">{homeAddress.country}</p>
                        <Button type="default" onClick={() => handleEdit(homeAddress, "homeAddress")} style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif", marginRight: "10px" }}>EDIT</Button>
                        <Button type="default" onClick={() => handleDelete("homeAddress")} style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif" }}>DELETE</Button>
                    </div>
                </div>
            ) : (
                <div className="address_card mx-auto text-center mb-5">
                    <div>
                        <h2>Home Address</h2>
                        <p>No home address found</p>
                    </div>
                </div>
            )}
            {shippingAddress && Array.isArray(shippingAddress) && shippingAddress.map((address, index) => (
                <div key={index} className="address_card mx-auto text-center mb-5">
                    <div>
                        <h2>Shipping Address</h2>
                        <p>{address.firstName} {address.lastName}</p>
                        <p>{address.street}</p>
                        <p>{address.city} {address.state} {address.zipCode}</p>
                        <p className="mb-3">{address.country}</p>
                        <Button type="default" onClick={() => handleEdit(address, "shippingAddress", address._id)} style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif", marginRight: "10px" }}>EDIT</Button>
                        <Button type="default" onClick={() => handleDelete("shippingAddress", address._id)} style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif" }}>DELETE</Button>
                    </div>
                </div>
            ))}
            
            {/* Edit Address Modal */}
            <Modal
                title={<span>EDIT ADDRESS</span>}
                open={isEditModalOpen}
                onCancel={handleEditCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={onEditFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                rules={[{ required: true, message: "Please enter your first name" }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                rules={[{ required: true, message: "Please enter your last name" }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item
                        name="street"
                        rules={[{ required: true, message: "Please enter your address" }]}
                    >
                        <Input placeholder="Address" />
                    </Form.Item>
                    
                    <Form.Item
                        name="city"
                        rules={[{ required: true, message: "Please enter your city" }]}
                    >
                        <Input placeholder="City" />
                    </Form.Item>
                    
                    <Form.Item
                        name="country"
                        rules={[{ required: true, message: "Please select a country" }]}
                    >
                        <Select placeholder="Select Country">
                            <Option value="Canada">Canada</Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="state"
                        rules={[{ required: true, message: "Please select a province" }]}
                    >
                        <Select placeholder="Select Province">
                            {canadianProvinces.map((province) => (
                                <Option key={province} value={province}>
                                    {province}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="zipCode"
                        rules={[{ required: true, message: "Please enter your postal/ZIP code" }]}
                    >
                        <Input placeholder="Postal/ZIP Code" />
                    </Form.Item>
                    
                    <Form.Item
                        name="phoneNumber"
                        rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                        <Input placeholder="Phone" />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="default" htmlType="submit" style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif", marginRight: "10px" }}>
                            Save
                        </Button>
                        <Button type="default" onClick={handleEditCancel} style={{ padding: "8px 15px", margin: "30px 0 0", font: "17px Baskerville, serif" }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </div>
    );
}