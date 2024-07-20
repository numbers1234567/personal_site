"use client"
import Image from "next/image";
import { TurnView } from "./turn_view";
import { BackSide, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry } from "three";
import { useLoader } from "@react-three/fiber";
import { FBXLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { useEffect } from "react";

export default function Home() {
  // Load Taiko object
  const taiko = useLoader(GLTFLoader, "taiko.glb").scene;
  useEffect(()=>{ // transforms
    taiko.scale.setScalar(0.1);
    taiko.rotation.set(Math.PI/4, Math.PI/2, 0, "YXZ");
  }, [taiko]);
  
  // Load Sierpinski triangle
  const sierpinski = useLoader(GLTFLoader, "gatton.glb").scene;
  useEffect(()=>{ // transforms
    sierpinski.scale.setScalar(0.075);
    sierpinski.rotation.set(7*Math.PI/16, Math.PI/2, 0, "YXZ");
  }, [sierpinski]);
  
  // Load box
  const box = useLoader(GLTFLoader, "luggage.glb").scene;
  useEffect(()=>{ // transforms
    box.scale.setScalar(0.075);
    box.rotation.set(0, Math.PI/4, 0, "YXZ");
  }, [box]);
  
  // Load monitor
  const monitor = useLoader(GLTFLoader, "monitor.glb").scene;
  useEffect(()=>{ // transforms
    monitor.scale.setScalar(0.05);
    monitor.rotation.set(0, Math.PI, 0, "YXZ");
  }, [monitor]);

  return <main>
    <div className="h-screen">
      <TurnView 
        content={[sierpinski, taiko, box, monitor]}
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
