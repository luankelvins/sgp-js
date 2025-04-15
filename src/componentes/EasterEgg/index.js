import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import ModalEspalhafatoso from "../ModalEspalhafatoso";
import fireworks from "../../assets/sounds/fireworks.mp3";

const EasterEgg = ({ ativar, onClose }) => {
  const [audio, setAudio] = useState(null);
  const [jaAtivado, setJaAtivado] = useState(false);

  useEffect(() => {
    if (ativar && !jaAtivado) {
      setJaAtivado(true);

      // 🎆 Confetes
      confetti({
        particleCount: 250,
        spread: 180,
        origin: { y: 0.6 },
      });

      // 🔊 Som de fogos
      const novoAudio = new Audio(fireworks);
      novoAudio.volume = 0.7;
      novoAudio.play().catch((err) => console.warn("Erro ao tocar som:", err));
      setAudio(novoAudio);
    }
  }, [ativar, jaAtivado]);

  const handleFecharModal = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setJaAtivado(false);
    if (onClose) onClose(); // Informa ao pai que deve "desativar"
  };

  if (!ativar || !jaAtivado) return null;

  return <ModalEspalhafatoso onClose={handleFecharModal} />;
};

export default EasterEgg;