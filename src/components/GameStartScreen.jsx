

export default function GameStartScreen({ onStart }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4">
      <img
        src="/portada.png"
        alt="Portada del juego"
        className="max-w-full h-auto mb-6 rounded-xl shadow-lg border-4 border-yellow-500"
      />
<button
  className="text-xl px-6 py-4 !bg-yellow-500 text-black hover:!bg-yellow-400 rounded-full font-bold shadow-xl"
  onClick={onStart}
>
  Empezar Juego
</button>

    </div>
  );
}
