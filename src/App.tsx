import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonConfig {
  name: string;
  japanese: string;
  emojis: string[];
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

const seasons: Record<Season, SeasonConfig> = {
  spring: {
    name: 'Primavera',
    japanese: '春 (はる)',
    emojis: ['🌸', '🌺', '🦋', '🌷', '🌻', '🐝'],
    colors: {
      background: 'linear-gradient(135deg, #ffb3d9 0%, #ffe6f2 50%, #f0f8ff 100%)',
      primary: '#ff9ec7',
      secondary: '#ffb3d9',
      accent: '#ff69b4'
    }
  },
  summer: {
    name: 'Verano',
    japanese: '夏 (なつ)',
    emojis: ['☀️', '🌞', '🏖️', '🌊', '🍦', '🦜'],
    colors: {
      background: 'linear-gradient(135deg, #87ceeb 0%, #ffeb3b 50%, #ffe082 100%)',
      primary: '#4fc3f7',
      secondary: '#81c784',
      accent: '#ffb74d'
    }
  },
  autumn: {
    name: 'Otoño',
    japanese: '秋 (あき)',
    emojis: ['🍂', '🍁', '🦔', '🎃', '🌰', '🦉'],
    colors: {
      background: 'linear-gradient(135deg, #d2691e 0%, #daa520 50%, #f4a460 100%)',
      primary: '#d2691e',
      secondary: '#daa520',
      accent: '#cd853f'
    }
  },
  winter: {
    name: 'Invierno',
    japanese: '冬 (ふゆ)',
    emojis: ['❄️', '⛄', '🎿', '🔥', '☃️', '🧊'],
    colors: {
      background: 'linear-gradient(135deg, #b0e0e6 0%, #e6f3ff 50%, #f0f8ff 100%)',
      primary: '#87ceeb',
      secondary: '#b0e0e6',
      accent: '#4682b4'
    }
  }
};

const FallingEmoji: React.FC<{ emoji: string; delay: number; id: number; onComplete?: () => void }> = ({ emoji, delay, id, onComplete }) => {
  const horizontalMovement = Math.random() * 60 - 30; // Movimiento horizontal aleatorio más sutil
  const startX = Math.random() * window.innerWidth; // Usar toda la anchura de la pantalla
  const duration = 10 + Math.random() * 6; // Duración consistente

  return (
    <motion.div
      key={`emoji-${id}`}
      className="falling-emoji"
      initial={{
        y: -100,
        x: startX,
        rotate: Math.random() * 360,
        opacity: 0,
        scale: 0.3 + Math.random() * 0.5
      }}
      animate={{
        y: window.innerHeight + 100,
        x: startX + horizontalMovement, // Añadir deriva horizontal
        rotate: [null, 180 + Math.random() * 360, 720 + Math.random() * 180],
        opacity: [0, 1, 1, 0.8, 0.3, 0],
        scale: [null, 1, 1.1, 1, 0.8, 0.2]
      }}
      exit={{
        opacity: 0,
        scale: 0,
        transition: { duration: 0.3 }
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Easing más natural
        x: {
          duration: duration,
          ease: "easeInOut"
        },
        opacity: {
          times: [0, 0.1, 0.3, 0.7, 0.9, 1],
          duration: duration
        },
        scale: {
          times: [0, 0.1, 0.3, 0.6, 0.8, 1],
          duration: duration
        },
        rotate: {
          times: [0, 0.3, 1],
          duration: duration
        }
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: 0,
        left: 0, // Asegurar que empiece desde la izquierda
        fontSize: '28px',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {emoji}
    </motion.div>
  );
};

function App() {
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [fallingEmojis, setFallingEmojis] = useState<Array<{ id: number; emoji: string; delay: number }>>([]);
  const [emojiCounter, setEmojiCounter] = useState(0); // Para generar IDs únicos

  const handleSeasonClick = (season: Season) => {
    setCurrentSeason(season);

    // Crear emojis que caen con variedades de la estación
    const seasonEmojis = seasons[season].emojis;
    const baseId = Date.now() + emojiCounter * 1000; // ID base único
    const newEmojis = Array.from({ length: 30 }, (_, i) => ({
      id: baseId + i,
      emoji: seasonEmojis[Math.floor(Math.random() * seasonEmojis.length)],
      delay: i * 0.25 // Delay más espaciado para efecto más suave
    }));

    // Agregar nuevos emojis a los existentes en lugar de reemplazarlos
    setFallingEmojis(prev => [...prev, ...newEmojis]);
    setEmojiCounter(prev => prev + 1);

    // Limpieza de seguridad: eliminar emojis que lleven más de 25 segundos
    setTimeout(() => {
      setFallingEmojis(prev => prev.filter(emoji =>
        !newEmojis.some(newEmoji => newEmoji.id === emoji.id)
      ));
    }, 25000);
  };

  const currentColors = currentSeason ? seasons[currentSeason].colors : {
    background: 'linear-gradient(135deg, #ffb3d9 0%, #ffe6f2 50%, #e1f5fe 100%)',
    primary: '#ff9ec7',
    secondary: '#b39ddb',
    accent: '#81c784'
  };

  return (
    <div
      className="App"
      style={{
        background: currentColors.background,
        transition: 'background 0.8s ease'
      }}
    >
      <div className="container">
        <motion.h1
          className="title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          🌈 Estaciones Kawaii 🌈
        </motion.h1>

        <div className="seasons-grid">
          {(Object.keys(seasons) as Season[]).map((season) => (
            <motion.button
              key={season}
              className="season-button"
              onClick={() => handleSeasonClick(season)}
              style={{
                background: currentSeason === season
                  ? `linear-gradient(135deg, ${seasons[season].colors.primary}40, ${seasons[season].colors.secondary}60)`
                  : 'rgba(255, 255, 255, 0.9)',
                border: currentSeason === season
                  ? `2px solid ${seasons[season].colors.accent}80`
                  : '2px solid rgba(255, 255, 255, 0.3)',
                color: '#2c3e50'
              }}
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              whileTap={{
                y: -2,
                scale: 0.98
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.8
              }}
            >
              <div className="button-content">
                <span className="emoji">{seasons[season].emojis[0]}</span>
                <span className="japanese-text">{seasons[season].japanese}</span>
                <span className="season-name">{seasons[season].name}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {currentSeason && (
          <motion.div
            className="season-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ color: currentColors.accent }}
          >
            <h2>¡Has seleccionado {seasons[currentSeason].japanese}!</h2>
            <p className="season-description">Disfruta de la magia de {seasons[currentSeason].name} ✨</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="sync">
        {fallingEmojis.map((emoji) => (
          <FallingEmoji
            key={`emoji-${emoji.id}`}
            emoji={emoji.emoji}
            delay={emoji.delay}
            id={emoji.id}
            onComplete={() => {
              // Limpiar automáticamente el emoji cuando termine la animación
              setFallingEmojis(prev => prev.filter(e => e.id !== emoji.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default App;
