import AuthProvider from "@/components/AuthProvider";
import Mainroutes from "./app/routes/Mainroutes";

function App() {
  return (
    <AuthProvider>
      <Mainroutes />
    </AuthProvider>
  );
}

export default App;
