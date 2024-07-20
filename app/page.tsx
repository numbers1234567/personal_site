"use client"
import Image from "next/image";
import { TurnView } from "./turn_view";
import { BackSide, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry } from "three";
import { useLoader } from "@react-three/fiber";
import { FBXLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

function taiko() {
  const objbase = useLoader(GLTFLoader, "./taiko.glb");
  const obj = objbase.scene.clone();
  obj.scale.setScalar(0.1);
  obj.traverse((child : Object3D) => {
    if ("material" in child) console.log(child.material);
  });
  obj.rotateY(Math.PI/2)
  obj.rotateX(Math.PI/4)
  return obj;
}
function gatton() {
  const objbase = useLoader(GLTFLoader, "./gatton.glb");
  const obj = objbase.scene.clone();
  obj.scale.setScalar(0.075);
  obj.traverse((child : Object3D) => {
    if ("material" in child) console.log(child.material);
  });
  obj.rotateY(Math.PI/2)
  obj.rotateX(Math.PI/2 - Math.PI/16)
  return obj;
}
function box() {
  const objbase = useLoader(GLTFLoader, "./luggage.glb");
  const obj = objbase.scene.clone();
  obj.scale.setScalar(0.075);
  obj.traverse((child : Object3D) => {
    if ("material" in child) console.log(child.material);
  });
  obj.rotateY(Math.PI/4)
  return obj;
}
function monitor() {
  const objbase = useLoader(GLTFLoader, "./monitor.glb");
  const obj = objbase.scene.clone();
  obj.scale.setScalar(0.05);
  obj.traverse((child : Object3D) => {
    if ("material" in child) console.log(child.material);
  });
  obj.rotateY(Math.PI)
  return obj;
}

export default function Home() {

  return <main>
    <div className="h-screen">
      <TurnView 
        content={[gatton(), taiko(), box(), monitor()]}
        text={[`
          <p>I am a Gatton Academy alumnus.</p>
          <p>Living away from my family for the first time was a great way for me to transition to my current studies at UT Dallas. Being surrounded by other very smart CS students propelled my problem-solving skills.</p>
            `,
            `
          <p>I study computer science at UT Dallas.</p>
          <p>My main interest has been machine learning, so I've done research and projects based on ML.</p>
          <p>Recently I've gotten into web development due to a personal ML project which involves web and my internship.</p>
          <p>I got a wide monitor, and I swear it actually improves the quality of my work. A funny story is that it ended up being free.</p>
            `,
            `
          <p>My family moved around the nation a bit while I was growing up.</p>
          <p>Some places I've lived are:</p>
          <list>
            <li>Michigan</li>
            <li>Iowa</li>
            <li>Utah</li>
            <li>Alabama (a couple cities)</li>
            <li>Kentucky (a couple cities)</li>
          </list>
            `,
            `
          <p>One of my favorite games: Taiko no Tatsujin</p>
          <p>This game simulates a drum. My favorite part is improving every day and seeing how my scores increase over time. I used to play osu!mania for a year and a half until I got bored. I got pretty decent at it, too.
            `,
        ]}
      />
    </div>
  </main>
}
