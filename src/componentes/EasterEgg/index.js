import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import ModalEspalhafatoso from "../ModalEspalhafatoso";
import fireworks from "../../assets/sounds/fireworks.mp3";

const EasterEgg = ({ ativar }) => {
  const [ativado, setAtivado] = useState(false);

  useEffect(() => {
    if (ativar && !ativado) {
      setAtivado(true);

      confetti({
        particleCount: 250,
        spread: 180,
        origin: { y: 0.6 },
      });

      const audio = new Audio(fireworks);
      audio.volume = 0.7;
      audio.play().catch((err) => {
        console.warn("Erro ao tocar som:", err);
      });
    }
  }, [ativar, ativado]);

  if (!ativado) return null;

  return <ModalEspalhafatoso />;
};

export default EasterEgg;