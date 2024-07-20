import Image from "next/image";
import { TurnView } from "./turn_view";
import { BackSide, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry } from "three";
import { useLoader } from "@react-three/fiber";
import { FBXLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { TurnViewContents } from "./turn_view_contents";

export default function Home() {
  return <main>
    <div className="h-screen">
      <TurnViewContents />
    </div>
  </main>
}
