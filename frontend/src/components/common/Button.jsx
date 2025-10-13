export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}) {
  const baseStyles =
    "px-8 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer border-none";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
