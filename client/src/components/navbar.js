import notifications from "./notification";

const Navbar = ({ userId }) => {
  return (
    <nav className="flex justify-between p-4 bg-blue-500 text-white">
      <h1 className="text-2xl">Valentines App ❤️</h1>
      <notifications userId={userId} />
    </nav>
  );
};

export default Navbar;
