const Avatar = ({ agent, size = 32 }) => {
  if (!agent) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: agent.color + "22",
        color: agent.color,
        border: `2px solid ${agent.color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {agent.initials}
    </div>
  );
};

export default Avatar;
