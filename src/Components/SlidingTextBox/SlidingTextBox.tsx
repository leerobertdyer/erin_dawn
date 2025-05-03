

export default function SlidingTextBox({ text }: { text: string }) {

  return (
    <div
      className="text-edcPurple-80 overflow-hidden whitespace-nowrap w-full box-content border-black border-2 rounded-md"
      style={{ fontSize: "clamp(.75rem, 5vw, 1.75rem)" }}
    >
      <p className={`${text.length > 11 ? "w-fit animate-slide-text" : "text-center"}`}>{text}</p>
    </div>
  );
}
