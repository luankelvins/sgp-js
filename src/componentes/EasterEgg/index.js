import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import ModalEspalhafatoso from "../ModalEspalhafatoso";
import fireworks from "../../assets/sounds/fireworks.mp3";

const EasterEgg = ({ ativar }) => {
  const [ativado, setAtivado] = useState(false);

  useEffect(() => {
    if (ativar && !ativado) {
      setAtivado(true);

      // 🎇 Confetes
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
      });

      // 🔊 Tocar som de fogos (usando o import corretamente)
      const audio = new Audio(fireworks);
      audio.volume = 0.6;
      audio.play().catch((err) => {
        console.warn("Erro ao tentar tocar o som:", err);
      });
    }
  }, [ativar, ativado]);

  if (!ativado) return null;

  return <ModalEspalhafatoso onClose={() => setAtivado(false)} />;
};

export default EasterEgg;