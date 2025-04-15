import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const EasterEgg = ({ ativar }) => {
  const [ativado, setAtivado] = useState(false);

  useEffect(() => {
    if (ativar && !ativado) {
      setAtivado(true);
      confetti();
    }
  }, [ativar]);

  if (!ativado) return null;

  return (
    <div className="alert alert-success mt-4 text-center fw-bold">
      🥳 Parabéns! Você encontrou o easter egg escondido no rodapé! 🎁
    </div>
  );
};

export default EasterEgg;