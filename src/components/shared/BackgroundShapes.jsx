const styles = `
  @keyframes drift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -20px) scale(1.03); }
  }
  @keyframes drift2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-25px, 15px) rotate(1.5deg); }
  }
  @keyframes drift3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, 25px) scale(0.97); }
  }
  @keyframes drift4 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-15px, -20px) rotate(-1deg); }
  }
  @keyframes drift5 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(25px, 15px) scale(1.02); }
  }

  .bg-shapes { transition: opacity 0.3s; }
  html[data-theme="dark"] .bg-shapes { opacity: 0; pointer-events: none; }
`;

export const BackgroundShapes = () => {
  return (
    <div
      className="bg-shapes"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{styles}</style>
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          filter: "blur(150px)",
        }}
      >
        <path
          className="bg-shapes__path1"
          d="M -50,100 C 200,150 400,400 1050,350"
          stroke="#a7beff"
          strokeWidth={100}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ animation: "drift1 18s ease-in-out infinite" }}
        />
        <path
          className="bg-shapes__path2"
          d="M 1050,50 C 700,200 300,500 -50,700"
          stroke="#8b7cf6"
          strokeWidth={80}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ animation: "drift2 22s ease-in-out infinite" }}
        />
        <path
          className="bg-shapes__path3"
          d="M -50,500 C 250,350 600,650 1050,550"
          stroke="#3f5fff"
          strokeWidth={120}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ animation: "drift3 26s ease-in-out infinite" }}
        />
        <path
          className="bg-shapes__path4"
          d="M 300,-50 C 350,300 700,600 1050,900"
          stroke="#ceddff"
          strokeWidth={60}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ animation: "drift4 20s ease-in-out infinite" }}
        />
        <path
          className="bg-shapes__path5"
          d="M -50,900 C 200,700 500,200 1050,150"
          stroke="#6366f1"
          strokeWidth={90}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ animation: "drift5 24s ease-in-out infinite" }}
        />
      </svg>
    </div>
  );
};
