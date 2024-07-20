"use client"
import { ReactElement, useEffect, useRef, useState } from "react";
import { Color, Euler, Mesh, Object3D, RectAreaLight, Vector3 } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import TWEEN from "@tweenjs/tween.js";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import Typewriter, { TypewriterClass } from 'typewriter-effect';

function Tween() {
    useFrame(() => {
      TWEEN.update();
    });
    return <></>;
  }

interface TurnViewProps {
    content : Object3D[],
    text : string[]
}

function OrbitContent(
    {currentFocus, content, setOrbitContentFinished} :
    {currentFocus : number, content : Object3D[], setOrbitContentFinished : (b:boolean)=>void}
) {
    const {camera} = useThree()
    let numChildren = content.length;
    const turnView = useRef<Mesh>(null);
    const container = useRef<Mesh>(null);
    const TRANS_TIME = 1000;

    useEffect(() => { // Camera is always in the same position
        camera.position.set(2.5,0.5,0);
        camera.lookAt(new Vector3(0,0,0));
    }, []);
   
    // Place key points where objects will be located and place children on keypoints
    useEffect(() => {
        numChildren = content.length;
        const added:[Object3D,Object3D][] = [];

        
        content.forEach(
            (value, index) => {
                const newObj = new Object3D();
                newObj.position.set(Math.cos(2*Math.PI * index / numChildren), 0, Math.sin(2*Math.PI * index / numChildren));
                turnView.current && added.push([turnView.current, newObj]);
                added.push([newObj, value]);
            }
        );
        for (const [parent, child] of added) {
            parent.add(child);
        }
        return () => added.forEach(([parent, child]) => parent.remove(child) ); // cleanup
    }, [content]);


    // Move key points to position based on currentFocus
    useEffect(() => {
        if (!turnView.current) return;
        setOrbitContentFinished(false);
        turnView.current.children.forEach(
            (child, index) => {
                const augIndex = ((index + currentFocus)%numChildren + numChildren)%numChildren;
                const newPos = new Vector3(Math.cos(2*Math.PI * augIndex / numChildren), 0, Math.sin(2*Math.PI * augIndex / numChildren))
                const newScale = augIndex == 0 ? 2 : 1

                child.userData.turnViewLoc = augIndex;

                new TWEEN.Tween(child.scale)
                    .to(new Vector3().setScalar(newScale), TRANS_TIME)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();

                new TWEEN.Tween(child.position)
                    .to(newPos, TRANS_TIME)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            }
        )
        setTimeout(()=>setOrbitContentFinished(true),TRANS_TIME);
    }, [content, currentFocus]);

    // Add lights
    useEffect(() => {
        if (!container.current) return;
        const added: [Object3D, Object3D][] = [];

        const white = new RectAreaLight("white", 2.5/4, 0.8, 0.8);
        white.rotateX(-Math.PI/2)
        white.position.set(1,0.3,0)
        added.push([container.current, white]);
        //added.push([container.current, new RectAreaLightHelper(white)])
        
        const red = new RectAreaLight(new Color(0xff0000), 1, 3, 0.2);
        red.rotateY(Math.PI/4)
        red.rotateX(-Math.PI/2)
        red.position.set(0,0.5,1)
        added.push([container.current, red]);
        //added.push([container.current, new RectAreaLightHelper(red)])
        
        const green = new RectAreaLight(new Color(0x00ff00), 1, 8, 0.2);
        green.rotateX(-Math.PI/2)
        green.position.set(-1,0.5,0)
        added.push([container.current, green]);
        //added.push([container.current, new RectAreaLightHelper(green)])
        
        const blue = new RectAreaLight(new Color(0x0000ff), 1, 3, 0.2);
        blue.rotateY(-Math.PI/4)
        blue.rotateX(-Math.PI/2)
        blue.position.set(0,0.5,-1)
        added.push([container.current, blue]);
        //added.push([container.current, new RectAreaLightHelper(blue)])

        for (const [parent, child] of added) parent.add(child);

        return () => { for (const [parent, child] of added) parent.remove(child); }
    }, []);
    
    return <mesh ref={container}>
        <mesh ref={turnView} />
    </mesh>
}

function OrbitText(
    {text, currentFocus, setOrbitTextFinished} :
    {text : string[], currentFocus : number, setOrbitTextFinished : (b : boolean)=>void}
) {
    let typewriterRef = useRef<TypewriterClass>();
    const focus = ((currentFocus % text.length) + text.length) % text.length;
    useEffect(() => {
        setOrbitTextFinished(false);
        typewriterRef.current?.deleteAll(0.05).start().typeString(text[focus]).start().callFunction(()=>setOrbitTextFinished(true));
    }, [focus]);

    return <div>
        <Typewriter 
            onInit={(typewriter) => {
                setOrbitTextFinished(false);
                typewriterRef.current = typewriter
                typewriter.typeString(text[focus]).start().callFunction(()=>setOrbitTextFinished(true));
            }}
            options={{cursor:"", delay : 0.125}}
        />
    </div>
}

export function TurnView(
    {content, text} : 
    TurnViewProps
) {
    const [currentFocus, setCurrentFocus] = useState<number>(0);
    const [orbitTextFinished, setOrbitTextFinished] = useState<boolean>(true);
    const [orbitContentFinished, setOrbitContentFinished] = useState<boolean>(true);

    function onButtonPress(newFocus : number) {
        if (orbitContentFinished && orbitTextFinished) 
            setCurrentFocus(newFocus);
    }
    return <div className="w-full h-full">
        <div className="float-left relative w-1/2 h-full">
            <Canvas>
                <Tween />
                <color attach="background" args={["#EEEEEE"]} />
                <OrbitContent currentFocus={currentFocus} content={content} setOrbitContentFinished={setOrbitContentFinished}/>
            </Canvas>
            {/* CONTROLS */}
            <div className="absolute w-full h-20 bottom-0">
                <div className="w-96 h-20 m-auto">
                    <button className="transition-all duration-500 float-left h-9 w-9 transform hover:scale-125" onClick={()=>onButtonPress(currentFocus-1)}>
                        <svg className="h-9 w-9">
                            <circle
                            cx="17"
                            cy="17"
                            r="16"
                            stroke="white"
                            strokeWidth="2"
                            fill="rgba(0,0,0,.66)" />
                            <text x="10" y="24" fill="white" fontSize={28} fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                                {"<"}
                            </text>
                        </svg>
                    </button>
                    <button className="transition-all duration-500 float-right h-9 w-9 transform hover:scale-125" onClick={()=>onButtonPress(currentFocus+1)}>
                        <svg className="h-9 w-9">
                            <circle
                            cx="17"
                            cy="17"
                            r="16"
                            stroke="white"
                            strokeWidth="2"
                            fill="rgba(0,0,0,.66)" />
                            <text x="10" y="24" fill="white" fontSize={28} fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                                {">"}
                            </text>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div className="float-right w-1/2 h-full" style={{fontFamily : "Consolas"}}>
            <OrbitText 
                text={text} 
                currentFocus={currentFocus}
                setOrbitTextFinished={setOrbitTextFinished}/>
        </div>
    </div> 
}
