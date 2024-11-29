/*To run this app, first "cd api" and
 than run command "nodemon index.js , 
 becoz index.js is in the api folder, and 
 index.js is running the backend ,
 after this , in money-tracker folder, "not in api folder",
 run yarn start
 the app will be started
*/ 


import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name,setName] = useState('');
  const [datetime,setDatetime] = useState('');
  const [description,setDescription] = useState('');
  const [transactions,setTransactions] = useState('');

  useEffect(()=>{
    getTransactions().then(setTransactions)
  }, []);

  async function getTransactions(){
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev){
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL+'/transaction';
    //grabbing the price
    const price = name.split(' ')[0];
    fetch(url,{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        price,
        //name should not contain the price
        name:name.substring(price.length+1),
        description,
        datetime,
      })
    }).then(response=>{
      response.json().then(json=>{
        //reset the form after getting data
        setName('');
        setDatetime('');
        setDescription('');
        console.log('result', json);
      })
    })
  }


  async function clearTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    await fetch(url, { method: 'DELETE' });
    setTransactions([]);
  }


  let balance = 0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1]
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type="text"
                 value={name} 
                 onChange={ev => setName(ev.target.value)} placeholder={'-150 new zara jacket'} />
          <input value={datetime}
                 onChange={ev => setDatetime(ev.target.value)}
                 type="datetime-local" />
        </div>
        <div className='description'>
          <input type="text" 
                 value={description} 
                 onChange={ev => setDescription(ev.target.value)}
                 placeholder={'description'}/>
        </div>
        <button type="submit">Add new transaction</button>
      </form>

      <button onClick={clearTransactions} style={{ marginTop: '10px', backgroundColor: '#f00', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
        Clear All Transactions
      </button>

      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction=>(
          <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " +(transaction.price<0?'red':'green')}>
                {transaction.price}
              </div>
              <div className="datetime">2024-11-03 12:56</div>
            </div>
          </div>
        ))}
        
      </div>
    </main>
  );
}

export default App;
