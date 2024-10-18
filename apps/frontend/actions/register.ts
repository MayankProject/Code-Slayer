"use server";
import db from "@/db";
var nameList = [
    'Quantum', 'Neon', 'Cryptic', 'Blaze', 'Frostbite', 'Nebula', 'Shadow', 'Viper',
    'Eclipse', 'Starlight', 'Zenith', 'Inferno', 'Apex', 'Specter', 'Phantom', 'Venom',
    'Nova', 'Blitz', 'Tempest', 'Cyclone', 'Omega', 'Echo', 'Vortex', 'Mirage', 'Rogue',
    'Pulse', 'Ember', 'Catalyst', 'Horizon', 'Vertex', 'Galactic', 'Void', 'Cobra',
    'Chrome', 'Nitro', 'Titan', 'Spectral', 'Falcon', 'Phoenix', 'Cyborg', 'Element',
    'Volt', 'Reaper', 'Fury', 'Arcane', 'Sonic', 'Savage', 'Drift', 'Strike', 'Ravage',
    'Glitch', 'Matrix', 'Riot', 'Myst', 'Aurora', 'Revenant', 'Spectra', 'Cipher',
    'Zero', 'Echo', 'Zen', 'Atom', 'Crimson', 'Draco', 'Pixel', 'Maverick', 'Surge',
    'Nemesis', 'Glacier', 'Scorch', 'Shifter', 'Blizzard', 'Pulsar', 'Ion', 'Meteor',
    'Phaser', 'Turbo', 'Bullet', 'Chimera', 'Shadowfax', 'Renegade', 'Tremor', 'Stealth',
    'Tempest', 'Warden', 'Ghost', 'Prophet', 'Shroud', 'Cyber', 'Strider', 'Blitzkrieg',
    'Orion', 'Hyperion', 'Havoc', 'Shockwave', 'Nocturne', 'Echo', 'Radiance', 'Thunder',
    'Helix', 'Dusk', 'Titanium', 'Ironclad', 'Gale', 'Morpheus', 'Axion', 'Astral',
    'Havoc', 'Blazer', 'Omen', 'Voidwalker', 'Spectre', 'Pulsefire', 'Singularity',
    'Hunter', 'Riptide', 'Nebulus', 'Warhawk', 'Fate', 'Zenith', 'Icarus', 'Nightmare',
    'Vendetta', 'Monolith', 'Oblivion', 'Kronos', 'Tempus', 'Cipher', 'Nyx', 'Thorne',
    'Skylark', 'Vindicator', 'Exodus', 'Dragoon', 'Sentinel', 'Radium', 'Eon', 'Onyx',
    'Cipher', 'Excalibur', 'Silver', 'Majestic', 'Quantum', 'Mach', 'Orbit', 'Thunderbolt',
    'Roguewave', 'Galactus', 'Crusader', 'Jaguar', 'Vanguard', 'Oracle', 'Mercenary', 'Eclipse'
];
export default async function() {
    const randomUsername = Math.random().toString(36).substr(2, 8);
    const randomPassword = Math.random().toString(36).substr(2, 8);
    const user = await db.user.create({
        data: {
            username: randomUsername,
            password: randomPassword,
            name: nameList[Math.floor(Math.random() * nameList.length)],
        },
    });
    if (!user) {
        throw new Error("Failed to create user");
    }
    return { username: user.username, password: user.password }
    // If registration is successful, sign in the user automatically

}
