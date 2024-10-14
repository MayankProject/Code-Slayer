import { useSession } from 'next-auth/react';
import React, { useRef, useEffect, useState } from 'react';

export class Player {
    id: number;
    position: { x: number; y: number };
    color: string;
    radius: number;
    velocity: { x: number; y: number };
    grabbed: boolean;
    grabbedPosition: { x: number; y: number };
    name: string;
    grabbedDistance: number;
    constructor(id: number, name: string, ballInitialPosition: { x: number; y: number }, ballColor: string, ballRadius: number, velocity: { x: number; y: number }, admin?: boolean) {
        this.position = { ...ballInitialPosition };
        this.id = id;
        this.color = ballColor;
        this.radius = ballRadius;
        this.velocity = { ...velocity };
        this.grabbed = false;
        this.grabbedPosition = { x: 0, y: 0 };
        this.grabbedDistance = 0;
        this.name = name
    }

    draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        if (this.grabbed) {
            c.beginPath();
            c.moveTo(this.position.x, this.position.y);
            c.lineTo(this.grabbedPosition.x, this.grabbedPosition.y);
            c.strokeStyle = 'white';
            c.stroke();
        }
        c.fillText(this.name, this.position.x - this.radius, this.position.y - this.radius * 2)

    }

    distanceFromPlayer(client_x: number, client_y: number) {
        const { x, y } = this.position;
        return Math.sqrt((y - client_y) ** 2 + (x - client_x) ** 2);
    }

    update(canvas: HTMLCanvasElement, gravity: number, lossVelocity: number, maxVelocity: number) {
        this.position = {
            x: this.velocity.x + this.position.x,
            y: this.velocity.y + this.position.y,
        };
        if (this.position.y + this.radius < canvas.height) {
            this.velocity.y += gravity;
        }

        if (this.position.y + this.radius >= canvas.height || this.position.y - this.radius <= 0) {
            this.velocity.y = -this.velocity.y + this.velocity.y * lossVelocity;
            if (this.position.y - this.radius <= 0) {
                this.velocity.y += 0.5;
            }
            if (this.position.y + this.radius >= canvas.height) {
                this.velocity.y -= 0.5;
            }
        }
        if (this.position.x + this.radius >= canvas.width || this.position.x - this.radius <= 0) {
            this.velocity.x = -this.velocity.x + this.velocity.x * lossVelocity;
        }
        if (!this.grabbed && this.grabbedDistance > 0) {
            let throwSpeed = this.grabbedDistance;
            let overspeed;
            if ((throwSpeed + Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)) > maxVelocity) {
                throwSpeed = maxVelocity;
                overspeed = true;
            }
            const angle = Math.atan2((this.grabbedPosition.y - this.position.y), (this.grabbedPosition.x - this.position.x));
            const xSpeed = Math.cos(angle) * throwSpeed;
            const ySpeed = Math.sin(angle) * throwSpeed;
            if (overspeed) {
                this.velocity = { x: xSpeed, y: ySpeed };
            } else {
                this.velocity = { x: xSpeed + this.velocity.x, y: ySpeed + this.velocity.y };
            }
            this.grabbedDistance = 0;
        }
    }
}
const HangBall: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const session = useSession()
    const parentDivRef = useRef<HTMLDivElement | null>(null);
    const ballRadius = 15;
    const velocity = { x: 0, y: 0 };
    const gravity = 1 / 5;
    const ballColor = 'white';
    const ballInitialPosition = { x: 100, y: parentDivRef.current?.getBoundingClientRect().height ? parentDivRef.current?.getBoundingClientRect().height - ballRadius : 100 };
    const lossVelocity = 1 / 10;
    const maxVelocity = 15;
    let animationFrameId: number;
    let player: Player;
    const canvas = canvasRef.current;
    const parentDiv = parentDivRef.current;
    const [showMessage, setShowMessage] = useState(true);
    const [canHideMessage, setCanHideMessage] = useState(false);

    useEffect(() => {
        if (!canvas || !parentDiv || !session || !session.data) return;

        const c = canvas.getContext('2d');
        if (!c) return;

        // Set canvas dimensions to match the parent div
        const setCanvasSize = () => {
            canvas.width = parentDiv.offsetWidth;
            canvas.height = parentDiv.offsetHeight;
        };

        setCanvasSize(); // Initial size setup
        player = new Player(session.data.user.id, session.data.user.name + " (You) ", ballInitialPosition, ballColor, ballRadius, velocity, true);

        addEventListener('mousedown', (e) => {
            if (!parentDivRef || !parentDivRef.current) return;
            const position = { x: e.clientX - parentDivRef.current.getBoundingClientRect().x, y: e.clientY - parentDivRef.current.getBoundingClientRect().y };
            const distanceFromPlayer = player.distanceFromPlayer(position.x, position.y);
            if (distanceFromPlayer < 200) {
                parentDivRef.current.style.cursor = 'grabbing';
                player.grabbed = true;
                player.grabbedPosition = position;
                player.grabbedDistance = distanceFromPlayer;
            }
        });

        addEventListener('mousemove', (e) => {
            if (!parentDivRef || !parentDivRef.current) return;
            const position = { x: e.clientX - parentDivRef.current.getBoundingClientRect().x, y: e.clientY - parentDivRef.current.getBoundingClientRect().y };
            if (player.grabbed) {
                player.grabbedPosition = position;
                player.grabbedDistance = player.distanceFromPlayer(position.x, position.y);
            }
        });

        addEventListener('mouseup', () => {
            if (!parentDivRef || !parentDivRef.current) return;
            parentDivRef.current.style.cursor = 'grab';
            player.grabbed = false;
        });



        function engine() {
            if (!canvas || !c) return;
            player.draw(c)
            player.update(canvas, gravity, lossVelocity, maxVelocity)
        }

        function main() {
            if (!canvas || !c) return;
            c.clearRect(0, 0, canvas.width, canvas.height);
            engine();
            animationFrameId = requestAnimationFrame(main);
        }
        if (canHideMessage) {
            setShowMessage(false);
            setCanHideMessage(false);
        }

        main();

        return () => {
            cancelAnimationFrame(animationFrameId);
            removeEventListener('mousedown', () => { });
            removeEventListener('mousemove', () => { });
            removeEventListener('mouseup', () => { });
        }

    }, [session]);


    useEffect(() => {
        setTimeout(() => {
            setShowMessage(false);
            setCanHideMessage(true);
        }, 3000);
    }, [showMessage])

    return (
        <div ref={parentDivRef} className='h-full cursor-grab w-full' >
            {
                showMessage && <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 text-white text-center" >
                    <div className='flex gap-4 items-center' >
                        <div className="flex space-x-2" >
                            <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-100" > </div>
                            < div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-200" > </div>
                            < div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-300" > </div>
                        </div>
                        <h1>
                            I know your attention span is shit mate, isn't it?
                        </h1>
                    </div>
                </div>
            }
            <canvas ref={canvasRef} style={{ display: 'block', opacity: showMessage ? 0 : 1 }} />
        </div>
    );
};

export default HangBall;
