import ExpensesChart from './components/ExpensesChart';
import data from "./data.json";
import "./App.css";

function App() {
  return (
    <div className="App bg-cream">
      <ExpensesChart data={data}/>
    </div>
  );
}

export default App;
