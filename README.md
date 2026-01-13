# Steampunk Open World MMOPG

A multi-square-kilometer open-world steampunk adventure with 20 interactive NPCs featuring full voice dialog and comprehensive controller support.

## Features

- **Massive Open World**: 4 sq km (2km x 2km) procedurally-varied terrain
- **20 Interactive NPCs**: Each with unique personalities and 25 lines of voice-acted dialog (500+ total lines)
- **Steampunk Aesthetics**: Clock towers, factories, steam pipes, gear statues, and brass fixtures
- **Full Voice Synthesis**: NPCs speak their dialog using Web Speech API
- **Dual Input Support**:
  - Mouse & Keyboard (WASD/Arrows + mouse look)
  - 8-axis gamepad/controller support
- **Web-Based**: Built with Three.js for cross-platform compatibility

## Installation

```bash
npm install
```

## Running the Game

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`

## Controls

### Keyboard & Mouse
- **WASD** or **Arrow Keys** - Move
- **Mouse** - Look around (click to lock pointer)
- **E** - Interact with NPCs
- **Space** - Continue dialog
- **Shift** - Sprint

### Gamepad (Xbox/PlayStation)
- **Left Stick** - Move
- **Right Stick** - Look around
- **A / Cross** - Interact / Continue dialog
- **L1/LB or L2/LT** - Sprint

## World Details

The world includes:
- Procedurally-generated terrain with hills and valleys
- 30+ steampunk structures (factories, clock towers, pipes, gear monuments)
- 100+ scattered props (crates, barrels)
- Dynamic lighting with atmospheric fog
- Real-time shadows

## NPCs

Meet 20 unique characters including:
- **Cogsworth** - Clock tower maintenance expert
- **Gearhart** - Master metallurgist
- **Steamwhistle** - Locomotive engineer
- **Valvina** - Chief water systems engineer
- **Rivetina** - Airship construction specialist
- **Mechanique** - Automaton designer
- And 14 more...

Each NPC has their own story, expertise, and personality conveyed through 25 unique dialog lines with voice synthesis.

## Technology Stack

- **Three.js** - 3D rendering engine
- **Vite** - Build tool and dev server
- **Web Speech API** - Voice synthesis
- **Gamepad API** - Controller support

## Browser Requirements

- Modern browser with WebGL 2.0 support
- Recommended: Chrome, Firefox, or Edge (latest versions)
- Speakers/headphones for voice dialog

## Performance Notes

The game is optimized for web deployment with:
- Efficient chunk-based terrain rendering
- Shadow map optimization
- Fog-based view distance management
- Efficient NPC update loops

For best performance, use a modern GPU and close unnecessary browser tabs.

## License

See LICENSE file for details.
