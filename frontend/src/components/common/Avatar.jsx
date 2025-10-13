export default function Avatar({ src, alt, firstName, lastName, size = "md" }) {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "?";
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-600 overflow-hidden flex-shrink-0`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
}
