import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import ModalEspalhafatoso from "../ModalEspalhafatoso";
import fireworks from "../../assets/sounds/fireworks.mp3";

const EasterEgg = ({ ativar }) => {
  const [ativado, setAtivado] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (ativar && !ativado) {
      setAtivado(true);

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
  }, [ativar, ativado]);

  const handleFecharModal = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setAtivado(false);
  };

  if (!ativado) return null;

  return <ModalEspalhafatoso onClose={handleFecharModal} animar />;
};

export default EasterEgg;