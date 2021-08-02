import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Country, State, City }  from 'country-state-city'
import FormContainer from '../components/FormContainer'

const CountrySelectScreen = () => {

    const [countries, setCountries] = useState(Country.getAllCountries())
    const [states, setStates] = useState([])
    //const [states, setStates] = useState(State.getAllStates())
    const [cities, setCities] = useState([])
    console.log('-----------------------')

    const [address, setAddress] = useState({
                            countryName: '',
                            stateName: '',
                            cityName: '',
                            countryCode: '',
                            phoneCode: '',
                            postCode: '',
                            currency: '',
                            latitude: '',
                            longitude: '',
                        })

    // countries.map(country => {
    //     const state = State.getStatesOfCountry(country.isoCode)
    //     if(state.length === 0) {
    //         console.log(country.name)
    //     }
    // })

    console.log('-----------------------')
    const [countrySelected, setCountrySelected] = useState({})
    const [stateSelected, setStateSelected] = useState({})
    const [citySelected, setCitySelected] = useState({})
    
    useEffect(() => {
        // console.log('Country')
        // console.log(countrySelected)
        // console.log('State')
        // console.log(stateSelected)
        // console.log('City')
        // console.log(citySelected)
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()
            console.log(countrySelected)
            console.log(stateSelected)
            console.log(citySelected)
    }

    return (
        <>
        <Form onSubmit={submitHandler}>
        <Row>
            {/* Country Field */}
            <Col md={4}>
                <Form.Group as={Col} controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                    as='input' list="countryList" autoComplete="nope" required autoFocus
                    name='country' placeholder='Select Country...'
                    onChange={(e) => {}}
                    onFocus={(e) => {}}
                    onBlur={(e) => {
                        const _countryList = document.getElementById('countryList').options
                        const _existedCountry = _countryList.namedItem(e.target.value.toUpperCase())

                        if (e.target.value === '') {
                            if (countrySelected.name && countrySelected.name !== '') {
                                console.log('for empty e.target.value ->' + e.target.value)
                                e.target.value = countrySelected.name
                            }
                        } else if (_existedCountry === null) {
                            if (countrySelected.name && countrySelected.name !== '') {
                                console.log('null_existedCountry ->' + countrySelected.name)
                                e.target.value = countrySelected.name
                            } else {
                                console.log('null_existedCountry ->' + countrySelected.name)
                                e.target.value = ''
                            }
                        } else if (_existedCountry && (_existedCountry.value !== countrySelected.name)) {
                            console.log('In Country ->')
                            console.log( _existedCountry)

                            //const _countrySelected = Country.getCountryByCode(_existedCountry.label)
                            const _countrySelected = JSON.parse(_existedCountry.innerText)

                            // ----- Setting Selected Country -----
                            setCountrySelected(_countrySelected)
                            //----------------------------------
                            setAddress(prevState => ({
                                ...prevState,
                                countryName: _countrySelected.name,
                                countryCode: _countrySelected.isoCode,
                                phoneCode: _countrySelected.phonecode,
                                currency: _countrySelected.currency,
                                latitude: _countrySelected.latitude,
                                longitude: _countrySelected.longitude,
                            }))

                            //----------------------------------

                            // Setting DropDown for States ------------
                            setStates(State.getStatesOfCountry(_countrySelected.isoCode))

                            // ----- Clear DropDown for Cities -----
                            setCities([])

                            // ----- Setting DropDown for phoneCode -----
                            document.getElementById('phoneCode').value = _countrySelected.phonecode

                            // ----- Do Empty -----setStateSelected({})
                            setStateSelected({})
                            document.getElementById('state').value = ''
                            
                            setCitySelected({})
                            document.getElementById('city').value = ''
                        }
                    }}
                >
                    {/* <option key='selectCountry' disabled>Select Country</option> */}
                </Form.Control>
                <datalist id='countryList'>
                {countries.map(country =>
                    <option
                        key={JSON.stringify(country)}
                        id={country.name.toUpperCase()}
                        value={country.name}
                        label={country.isoCode}
                    >{JSON.stringify(country)}</option>
                )}
                </datalist>
            </Form.Group>
            </Col>
            {/* State Field */}
            <Col md={4}>
                <Form.Group as={Col} controlId='state'>
                <Form.Label>State</Form.Label>
                <Form.Control
                    readOnly={JSON.stringify(countrySelected) === '{}'}
                    as='input' list='stateList' autoComplete="nope" required
                    name='state' placeholder="Select State..."
                    onChange={(e) => {}}
                    onFocus={(e) => {}}
                    onBlur={(e) => {
                        const _stateList = document.getElementById('stateList').options
                        const _existedState = _stateList.namedItem(e.target.value.toUpperCase())

                        if (e.target.value === '') {
                            if (stateSelected.name && stateSelected.name !== '') {
                                console.log('for empty e.target.value ->' + e.target.value)
                                e.target.value = stateSelected.name
                            }
                        } else if (_existedState === null) {
                            if (stateSelected.name && stateSelected.name !== '') {
                                console.log('null_existedCountry ->' + stateSelected.name)
                                e.target.value = stateSelected.name
                            } else {
                                console.log('null_existedCountry ->' + stateSelected.name)
                                e.target.value = ''
                            }
                        } else if (_existedState && (_existedState.value !== stateSelected.name)) {
                            console.log('In State -> ')
                            console.log(_existedState)

                            //const _stateSelected = State.getStateByCodeAndCountry(_existedState.label, countrySelected.isoCode)
                            const _stateSelected = JSON.parse(_existedState.innerText)

                            // Setting Selected State
                            setStateSelected(_stateSelected)

                            // Setting DropDown for Cities
                            setCities(City.getCitiesOfState(_stateSelected.countryCode, _stateSelected.isoCode))

                            // Do Empty -------------------------
                            setCitySelected({})
                            document.getElementById('city').value = ''
                        }
                            
                    }}
                >
                    {/* <option key='selectState' disabled>Select State</option> */}
                </Form.Control>
                <datalist id='stateList'>
                {states.map(state =>
                    <option
                        key={JSON.stringify(state)}
                        id={state.name.toUpperCase()}
                        value={state.name}
                        label={state.isoCode}
                    >{JSON.stringify(state)}</option>
                )}
                </datalist>
            </Form.Group>
            </Col>
            {/* City Field */}
            <Col md={4}>
                <Form.Group as={Col} controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control
                    readOnly={JSON.stringify(countrySelected) === '{}' || JSON.stringify(stateSelected) === '{}'}
                    as='input' list='cityList' autoComplete="nope" required
                    name='city' placeholder="Enter City..."
                    onChange={(e) => {
                        //console.log('onChange ->' + e.target.value)
                    }}
                    onFocus={(e) => {
                        //console.log('onFocus ->' + e.target.value)
                    }}
                    onBlur={(e) => {
                        const _cityList = document.getElementById('cityList').options
                        const _existedCity = _cityList.namedItem(e.target.value.toUpperCase())

                        if (e.target.value === '') {
                            if (citySelected.name && citySelected.name !== '') {
                                console.log('for empty e.target.value ->' + e.target.value)
                                e.target.value = citySelected.name
                            }
                        } else if (_existedCity === null) {
                            if (citySelected.name && citySelected.name !== '') {
                                console.log('null_existedCity ->' + citySelected.name)
                                e.target.value = citySelected.name
                            } else {
                                console.log('null_existedCity ->' + citySelected.name)
                                e.target.value = ''
                            }
                        } else if (_existedCity && (_existedCity.value !== citySelected.name)) {
                            console.log(`In City ->`)
                            console.log(_existedCity)

                            //const _citySelected = 
                            const _citySelected = JSON.parse(_existedCity.innerText)

                            // Setting Selected City
                            setCitySelected(_citySelected)
                        }
                    }}
                >
                    {/* <option key='selectCity' disabled>Select City</option> */}
                </Form.Control>
                <datalist id='cityList'>
                {cities.map(city =>
                    <option
                        key={JSON.stringify(city)}
                        id={city.name.toUpperCase()}
                        value={city.name}
                        label={city.countryCode + '/' + city.stateCode}
                    >{JSON.stringify(city)}</option>
                )}
                </datalist>
            </Form.Group>    
            </Col>
        </Row>
        <Row>
            <Col>
            {/* Phone Code */}
            <Form.Group as={Row} controlId='phoneCode'>
                <Form.Label column sm="2">Phone Code</Form.Label>
                <Col sm="10">
                <Form.Control
                    //readOnly
                    as='input' list='phoneCodeList' autoComplete="nope" required readOnly
                    name='phoneCode' placeholder="Enter Phone Number..."
                    onChange={(e) => {
                        //console.log('onChange ->' + e.target.value)
                    }}
                    onFocus={(e) => {
                        //console.log('onFocus ->' + e.target.value)
                    }}
                    onBlur={(e) => {
                        // const _cityList = document.getElementById('cityList').options
                        // const _existedCity = _cityList.namedItem(e.target.value.toUpperCase())

                        // if (e.target.value === '') {
                        //     if (citySelected.name && citySelected.name !== '') {
                        //         console.log('for empty e.target.value ->' + e.target.value)
                        //         e.target.value = citySelected.name
                        //     }
                        // } else if (_existedCity === null) {
                        //     if (citySelected.name && citySelected.name !== '') {
                        //         console.log('null_existedCity ->' + citySelected.name)
                        //         e.target.value = citySelected.name
                        //     } else {
                        //         console.log('null_existedCity ->' + citySelected.name)
                        //         e.target.value = ''
                        //     }
                        // } else if (_existedCity && (_existedCity.value !== citySelected.name)) {
                        //     console.log(`In City ->`)
                        //     console.log(_existedCity)

                        //     //const _citySelected = 
                        //     const _citySelected = JSON.parse(_existedCity.innerText)

                        //     // Setting Selected City
                        //     setCitySelected(_citySelected)
                        // }
                    }}
                >
                    {/* <option key='selectPhoneCode' disabled>Select phone Code</option> */}
                </Form.Control>
                </Col>
                <datalist id='phoneCodeList'>
                {countries.map(phoneCode =>
                    <option
                        key={phoneCode.name}
                        id={phoneCode.name.toUpperCase()}
                        value={phoneCode.phonecode}
                        label={phoneCode.isoCode}
                    >{JSON.stringify(phoneCode)}</option>
                )}
                </datalist>
            </Form.Group>
            </Col>
        </Row>
            <Button type='submit' variant='primary'>Submit</Button>
        </Form>
    </>
    )
}

export default CountrySelectScreen