import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../views/Login";
import Register from "../views/Register";
import Home from "../views/Home";
import CheckEmail from "../views/CheckEmail";
import Account from "../views/Account";
// Artificial Flower subcategories
import ArtificialHydrangeas from "../views/categories/ArtificialFlower/ArtificialHydrangeas";
import ArtificialRoses from "../views/categories/ArtificialFlower/ArtificialRoses";
import ArtificialLilies from "../views/categories/ArtificialFlower/ArtificialLilies";
import ArtificialPeonies from "../views/categories/ArtificialFlower/ArtificialPeonies";
import ArtificialBlossom from "../views/categories/ArtificialFlower/ArtificialBlossom";
import ArtificialTulips from "../views/categories/ArtificialFlower/ArtificialTulips";
import ArtificialOrchids from "../views/categories/ArtificialFlower/ArtificialOrchids";
import ArtificialMagnolia from "../views/categories/ArtificialFlower/ArtificialMagnolia";
import ArtificialBerriesAndDahlias from "../views/categories/ArtificialFlower/ArtificialBerriesAndDahlias";
import ArtificialWildFlowers from "../views/categories/ArtificialFlower/ArtificialWildFlowers";
// Artificial Greenery subcategories
import ArtificialEucalyptus from "../views/categories/ArtificialGreenery/ArtificialEucalyptus";
import ArtificialFoliageAndLeaves from "../views/categories/ArtificialGreenery/ArtificialFoliageAndLeaves";
import ArtificialGarland from "../views/categories/ArtificialGreenery/ArtificialGarland";
import ArtificialPlants from "../views/categories/ArtificialGreenery/ArtificialPlants";
// Artificial Arrangement subcategories
import BridalArrangement from "../views/categories/ArtificialArrangement/BridalArrangement";
import FlowerBouquet from "../views/categories/ArtificialArrangement/FlowerBouquet";
import LongArrangement from "../views/categories/ArtificialArrangement/LongArrangement";
// Vases & Urns subcategories
import MetalVase from "../views/categories/VasesUrns/MetalVase";
import PlasticVase from "../views/categories/VasesUrns/PlasticVase";
import GlassVase from "../views/categories/VasesUrns/GlassVase";
import Addresses from "../views/Addresses";
import Cart from "../views/Cart";

export default function Router() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="check-email" element={<CheckEmail />} />
          <Route path="cart" element={<Cart />} />
          {/* Artificial Flower subcategories */}
          <Route path="categories/artificial-hydrangeas" element={<ArtificialHydrangeas />} />
          <Route path="categories/artificial-roses" element={<ArtificialRoses />} />
          <Route path="categories/artificial-lilies" element={<ArtificialLilies />} />
          <Route path="categories/artificial-peonies" element={<ArtificialPeonies />} />
          <Route path="categories/artificial-blossom" element={<ArtificialBlossom />} />
          <Route path="categories/artificial-tulips" element={<ArtificialTulips />} />
          <Route path="categories/artificial-orchids" element={<ArtificialOrchids />} />
          <Route path="categories/artificial-magnolia" element={<ArtificialMagnolia />} />
          <Route path="categories/artificial-berries-dahlias" element={<ArtificialBerriesAndDahlias />} />
          <Route path="categories/artificial-wild-flowers" element={<ArtificialWildFlowers />} />
          {/* Artificial Greenery subcategories */}
          <Route path="categories/artificial-eucalyptus" element={<ArtificialEucalyptus />} />
          <Route path="categories/artificial-foliage-leaves" element={<ArtificialFoliageAndLeaves />} />
          <Route path="categories/artificial-garland" element={<ArtificialGarland />} />
          <Route path="categories/artificial-plants" element={<ArtificialPlants />} />
          {/* Artificial Arrangement subcategories */}
          <Route path="categories/bridal-arrangement" element={<BridalArrangement />} />
          <Route path="categories/flower-bouquet" element={<FlowerBouquet />} />
          <Route path="categories/long-arrangement" element={<LongArrangement />} />
          {/* Vases & Urns subcategories */}
          <Route path="categories/metal-vase" element={<MetalVase />} />
          <Route path="categories/plastic-vase" element={<PlasticVase />} />
          <Route path="categories/glass-vase" element={<GlassVase />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}