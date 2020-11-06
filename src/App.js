import React,{useState,useEffect} from 'react';
import './App.css';
import {FormControl, Select, MenuItem, CardContent,Card} from "@material-ui/core";
import {sortData,prettyPrintStat} from './util.js';
import './Components/InfoBox.js'
import InfoBox from './Components/InfoBox.js';
import Map from './Components/Map.js';
import Table from './Components/Table.js';
import LineGraph from './Components/LineGraph.js'
import "leaflet/dist/leaflet.css"
function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,settableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:22.460850, lng:77.860725});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");
  useEffect(() => {
   fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[]);
  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        const sortedData = sortData(data);
        console.log(sortedData);
        setCountries(countries);
        settableData(sortedData);
        setMapCountries(data);
      });
    };
    getCountriesData();
  },[]);

  const onCountrychange = async (event) => {
    const countrycode = event.target.value;
    console.log(countrycode);
    setCountry(countrycode);
    const url = countrycode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countrycode}`;
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countrycode);
      setCountryInfo(data);
      countrycode === "worldwide" ? setMapCenter({lat:22.460850, lng:77.860725}) : (data.countryInfo.lat && data.countryInfo.lat && setMapCenter([data.countryInfo.lat,data.countryInfo.long]));
      setMapZoom(4);
    });
  };
  console.log(countryInfo);
  return (
  <div className="App">
    <div className="app__left">
      <div className="app__header">
      <h1>COVID - 19 Tracker</h1>
      <FormControl className = "app__dropdown">
        <Select
        variant = "outlined"
        value={country}
        onChange = {onCountrychange}>
          <MenuItem value="worldwide">WorldWide</MenuItem>
          {
            countries.map((country)=>(
              <MenuItem value={country.value} key={country.value}>{country.name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox active = {casesType === "cases"} onClick = {e => setcasesType('cases')} type="cases" title="Coronavirus" cases ={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox active = {casesType === "recovered"} onClick = {e => setcasesType('recovered')} type="recovered" title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox active = {casesType === "deaths"} onClick = {e => setcasesType('deaths')} type="deaths" title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div>
      <Map 
        casesType = {casesType}
        countries = {mapCountries}
        center={mapCenter}
        zoom={mapZoom}
      />
    </div>
    <Card className="app__right">
      <CardContent>
        <h3>Live Cases by country</h3>
        <Table countries={tableData}/>
        <h3>Worldwide new {casesType}</h3>
        <LineGraph className = "app__graph" casesType={casesType}/>
      </CardContent>
    </Card>
  </div>
  );
}

export default App;
