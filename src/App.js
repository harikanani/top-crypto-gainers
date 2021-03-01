import React from "react";

class App extends React.Component{
  state = {
    sorted_list: [],
    requestStatus: 'loading'
  };

  async fetchCoins() {
    try {
      //fetching api from coingecko
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage='1h%2C24h'`);
      //converting response in JSON format
      const result = await response.json();
      //extracting necessary properties using map method
      const new_list = result.map(item => {
        return {
          name: item.name,
          price_change: item.price_change_percentage_24h,
          symbol: item.symbol,
          image: item.image
        }
      });
      //function for sort method to sort in ascending order
      function Comparator(a, b) {
        if (a.price_change > b.price_change) return 0;
        if (a.price_change < b.price_change) return 0;
        return -1;
      }
      //sorting new_list in ascending order based on price change in 24h
      new_list.sort(Comparator);
      //slicing array to get top ten coins
      const updated_list = new_list.slice(0,9);
      //updating state
      this.setState({ 
        sorted_list: updated_list, 
        requestStatus: 'success'
      })

    }
    //if fetching api fails, requestStatus updated to 'failed'
    catch {
      this.setState({
        ...this.state,
        requestStatus: 'failed'
      })
    }
    
  }

  async componentDidMount(){
    //function fetchCoins will run 2s after mounting
    setTimeout(async () => {
      await this.fetchCoins();
    }, 2000);
  }


  render() {
    return (
    <div className="page">
      <div className="header">
        <img className="image" src="./hcd-removebg.png" alt="logo"/>
        <h1 className="heading">HOT COIN DETECTOR</h1>
      </div>
      {
        //checking if requestStatus is loading
        this.state.requestStatus === 'loading'
        ?
        <div className="pseudo">
          <img src="./806.gif"/>
          <h2>Loading...</h2>
        </div>
        :
        (
          //checking if requestStatus is failed
          this.state.requestStatus === 'failed'
          ?
          <div className="error"> Error loading page... </div>
          :
          //if requestStatus is success
          <div className="list">
            <ul>
              <div className="list-items">
                {
                  //mapping over array to display image, name, symbol and %change 
                  this.state.sorted_list.map((c, index)=>{
                  return <li key={index}>
                    <img className="picture" src={c.image} style = { { widht: "60%", height: "35%" } }/> 
                    {c.name} 
                    <b>{(c.symbol).toUpperCase()}</b> 
                    {(c.price_change).toFixed(2)}% 
                    {/*redirecting to buy the coins from Binance*/}
                    <button className="buy" onClick={()=>window.open(`https://www.binance.com/en/trade/${c.symbol}_BTC`, '_blank')}>Buy on Binance</button>
                    {/*redirecting to buy the coins from CoinDCX*/}
                    <button className="buy1" onClick={()=>window.open(`https://coindcx.com/trade/${c.symbol}BTC`, '_blank')}>Buy on CoinDCX</button>
                  </li>
                  })
                }
              </div>
            </ul>
          </div>
        )
      }
    </div>
    );
  };
}
export default App;
