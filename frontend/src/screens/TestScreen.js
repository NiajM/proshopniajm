import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import postalCodes from 'postal-codes-js'
import postalCodeHelpers from 'postal-code-helpers'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import { Country, State, City }  from 'country-state-city'

const CountrySelectScreen = () => {

    console.log('-----------Start------------')

    const [countries, setCountries] = useState(Country.getAllCountries())
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [posts, setPosts] = useState([])

    const [address, setAddress] = useState({
                countryName: 'Bangladesh', stateName: 'Dhaka District', cityName: 'Dhaka',
                countryCode: 'BD', stateCode: '13', postCode: '',
                addressLine1: '', addressLine2: '',
                fullName: '', phoneCode: '880', phoneNumber: '',
                currency: 'BDT', latitude: 23.81093000, longitude: 90.36542000
            })

    // console.log(address)
    console.log(`countryName-> ${address.countryName}`)
    console.log(`stateName-> ${address.stateName}`)
    console.log(`cityName-> ${address.cityName}`)
    console.log(`countryCode-> ${address.countryCode}`)
    console.log(`stateCode-> ${address.stateCode}`)
    console.log(`phoneCode-> ${address.phoneCode}`)
    console.log(`postCode-> ${address.postCode}`)
    console.log(`currency-> ${address.currency}`)
    console.log(`latitude-> ${address.latitude}`)
    console.log(`longitude-> ${address.longitude}`)
    
    useEffect(() => {
        console.log('I am from useEffect')

        getPostCodesByCountryAndStateCode(address.countryCode, address.stateCode).then(response => setPosts(response))

        document.getElementById('countryName').value = address.countryName
        document.getElementById('stateName').value = address.stateName
        document.getElementById('cityName').value = address.cityName
        document.getElementById('postCode').value = address.postCode
        document.getElementById('phoneCode').innerText = address.phoneCode
        document.getElementById('phoneNumber').value = address.phoneNumber
        
        setStates(State.getStatesOfCountry(address.countryCode))
        if (address.stateCode !== '') {
            setCities(City.getCitiesOfState(address.countryCode, address.stateCode))
        }
        
    }, [])

//------------Get Postcodes from Back4AppApi with Validatin----------------//
    // Always returns a Array()
    const postcodesBack4AppApi = async (countryCode='', adminCode1='', adminCode2='') => {

        const where = encodeURIComponent(JSON.stringify({
            "adminCode1": { "$regex": `${adminCode1}` },
            "adminCode2": { "$regex": `${adminCode2}` }
        }))
        
        const url = `https://parseapi.back4app.com/classes/Worldzipcode_${countryCode}?count=1&limit=1000&order=-accuracy&keys=adminName1,adminName2,geoPosition,placeName,postalCode&where=${where}`

        const config = { headers: {
            'X-Parse-Application-Id': '3Zvouv0VEyTldtfmzGiA0b7qxG7O9Vj0SuDexKN5', // This is your app's application id
            'X-Parse-REST-API-Key': 'wX4IVUoSy1nyqHbT8l0WVHn7uvsCtIEgpGTS79xF', // This is your app's REST API key
        }}

        const response = await fetch(url, config).catch(error => {

            return new Response(JSON.stringify({
                message: "Stupid network Error",
                error: error instanceof Object ? error.message : error.toString()
            }))
        })
        
        const data = await response.json() // Here you have the data that you need
        // console.log(JSON.stringify(data, null, 2))

        if (data.results && Array.isArray(data.results)) {
            console.log('Total Data Counts -> ' + data.count)
            return data.results
        } else {
            if (!response.ok) { console.log('Response OK -> ' + response.ok) }
            if (response.status !== 200) { console.log('Response Status -> ' + response.status) }
            if (data.error) { console.log('Response Error -> ' + data.error) }
            if (data.message) { console.log('Response Message-> ' + data.message) }
            if (data.results && !Array.isArray(data.results)) { console.log('Results not Array') }
            return []
        }
    }

    // adminCode1 or adminCode2, either one of them be an Empty String
    const checkValidityPostcodesBack4AppApi = async (countryCode='', adminCode1='', adminCode2='') => {

        const postcodes = await postcodesBack4AppApi(countryCode, adminCode1, adminCode2)
        let validPostcodes = []
        postcodes.map(post => {
            if (postalCodes.validate(countryCode, post.postalCode) === true) {
                validPostcodes.push(post)
            }
        })
        return validPostcodes
    }

    // Tries 3 different ways to get Results
    const getPostCodesByCountryAndStateCode = async (countryCode='', adminCode='') => {

        if (adminCode === '') {
            return await checkValidityPostcodesBack4AppApi(countryCode, '', '')
        } else {
            console.log('adminCode1')
            let postcodes = await checkValidityPostcodesBack4AppApi(countryCode, adminCode, '')
            if (postcodes.length === 0) {
                console.log('adminCode2')
                postcodes = await checkValidityPostcodesBack4AppApi(countryCode, '', adminCode)
                if (postcodes.length === 0) {
                    console.log('adminCode3')
                    postcodes = await checkValidityPostcodesBack4AppApi(countryCode, '', '')
                }
            }
            return postcodes
        }
    }
//----------------------------End----------------//

    // str === String() and return String()
    const capitalizedEachWord = (str = '') => {

        const arr = str.split(" ")

        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
        }
        const str2 = arr.join(" ")
        return str2
    }

//------------------Actions by onChange--------------------//

    const actionsByCountryChange = (e) => {
        
        e.preventDefault()
        const _countryList = document.getElementById('countryList').options
        const _existedCountry = _countryList.namedItem(e.target.value.toUpperCase())

        if (e.target.value === '') {
            if (address.countryName !== '') {
                e.target.value = address.countryName
                console.log('for empty e.target.value ->' + e.target.value)
            }
        } else if (_existedCountry === null) {
            if (address.countryName !== '') {
                console.log('not match Country ->' + address.countryName)
                e.target.value = address.countryName
            } else {
                console.log('not match Country ->' + address.countryName)
                e.target.value = ''
            }
        } else if (_existedCountry && (_existedCountry.value !== address.countryName)) {
            const _countrySelected = JSON.parse(_existedCountry.innerText)
            if (e.target.value !== _countrySelected.name) {
                e.target.value = _countrySelected.name
            }

            // ----- Setting Selected Country -----
            setAddress(prevState => ({
                ...prevState,
                countryName: _countrySelected.name,
                countryCode: _countrySelected.isoCode,
                phoneCode: _countrySelected.phonecode,
                currency: _countrySelected.currency,
                latitude: Number(_countrySelected.latitude),
                longitude: Number(_countrySelected.longitude),
                stateName: '',
                stateCode: '',
                cityName: '',
                postCode: '',
            }))

            // ----- Update Field Value -----
            document.getElementById('stateName').value = ''
            document.getElementById('cityName').value = ''
            document.getElementById('postCode').value = ''
            document.getElementById('phoneCode').innerText = _countrySelected.phonecode

            // Update Suggestions for States, Cities and Posts ------------
            setStates(State.getStatesOfCountry(_countrySelected.isoCode))
            setCities([])
            setPosts([])
        }
    }

    const actionsByStateChange = (e) => {
        
        e.preventDefault()
        const _stateList = document.getElementById('stateList').options
        const _existedState = _stateList.namedItem(e.target.value.toUpperCase())

        if (e.target.value === '') {
            if (address.stateName !== '') {
                console.log('for empty e.target.value ->' + address.stateName)
                e.target.value = address.stateName
            }
        } else if (_existedState === null) {

            console.log('Not Suggestions ->' + e.target.value)
            e.target.value = capitalizedEachWord(e.target.value)

            if (e.target.value !== address.stateName) {

                // Update Suggestions for Posts -----
                // Calling first since it's calling a async function
                getPostCodesByCountryAndStateCode(address.countryCode, '').then(response => setPosts(response))

                // Setting Selected State -------------------
                setAddress(prevState => ({
                    ...prevState,
                    stateName: e.target.value,
                    stateCode: '',
                    latitude: Number(Country.getCountryByCode(address.countryCode).latitude),
                    longitude: Number(Country.getCountryByCode(address.countryCode).longitude),
                    cityName: '',
                    postCode: ''
                }))

                // ----------- Update Field Value --------------
                document.getElementById('cityName').value = ''
                document.getElementById('postCode').value = ''
                
                // Update Suggestions for Cities and Posts -----
                setCities([])
            }
        } else if (_existedState && (_existedState.value !== address.stateName)) {

            const _stateSelected = JSON.parse(_existedState.innerText)
            // Update Suggestions for Posts -----
            // Calling first since it's calling a async function
            getPostCodesByCountryAndStateCode(address.countryCode, _stateSelected.isoCode).then(response => setPosts(response))

            if (e.target.value !== _stateSelected.name) {
                e.target.value = _stateSelected.name
            }

            // Setting Selected State -------------------
            setAddress(prevState => ({
                ...prevState,
                stateName: _stateSelected.name,
                stateCode: _stateSelected.isoCode,
                latitude: Number(_stateSelected.latitude),
                longitude: Number(_stateSelected.longitude),
                cityName: '',
                postCode: ''
            }))

            // -----------Update Firld Value--------------
            document.getElementById('cityName').value = ''
            document.getElementById('postCode').value = ''

            // Update Suggestions for Cities
            setCities(City.getCitiesOfState(_stateSelected.countryCode, _stateSelected.isoCode))
        }
    }

    const actionsByCityChange = (e) => {
        
        e.preventDefault()
        const _cityList = document.getElementById('cityList').options
        const _existedCity = _cityList.namedItem(e.target.value.toUpperCase())

        if (e.target.value === '') {
            if (address.cityName !== '') {
                console.log('for empty e.target.value ->' + address.cityName)
                e.target.value = address.cityName
            }
        } else if (_existedCity === null) {
            console.log('Not Suggestions ->' + e.target.value)
            e.target.value = capitalizedEachWord(e.target.value)

            if (e.target.value !== address.cityName) {

                // Setting Selected City -------------------
                setAddress(prevState => ({
                    ...prevState, cityName: e.target.value,
                }))
            }
        } else if (_existedCity && (_existedCity.value !== address.cityName)) {

            const _citySelected = JSON.parse(_existedCity.innerText)
            if (e.target.value !== _citySelected.name) {
                e.target.value = _citySelected.name
            }

            // Setting Selected City -------------------
            setAddress(prevState => ({
                ...prevState,
                cityName: _citySelected.name,
                latitude: Number(_citySelected.latitude),
                longitude: Number(_citySelected.longitude)
            }))
        }
    }

    const actionsByPostChange = (e) => {
        
        e.preventDefault()
        const _postList = document.getElementById('postList').options
        const _existedPost = _postList.namedItem(e.target.value.toUpperCase())

        if (e.target.value === '') {
            if (address.postCode !== '') {
                console.log('for empty e.target.value ->' + address.postCode)
                e.target.value = address.postCode
            }
        } else if (_existedPost === null && e.target.value !== address.postCode) {
            
            console.log('Not Suggestions for ->' + e.target.value)

            if (postalCodes.validate(address.countryCode, e.target.value) === true || postalCodeHelpers.validate(e.target.value, address.countryCode)) {
                // Setting Selected Post -------------------
                setAddress(prevState => ({
                    ...prevState, postCode: e.target.value
                }))
            } else {
                console.log('postalCodes not valid -> ')
                console.log(postalCodes.validate(address.countryCode, e.target.value))
                e.target.value = address.postCode
            }

        } else if (_existedPost && (_existedPost.value !== address.postCode)) {

            console.log(JSON.parse(_existedPost.innerText))
            const _postSelected = JSON.parse(_existedPost.innerText)
            if (e.target.value !== _postSelected.postalCode) {
                e.target.value = _postSelected.postalCode
            }
            // Setting Selected Post -------------------
            setAddress(prevState => ({
                ...prevState,
                postCode: _postSelected.postalCode,
                latitude: Number(_postSelected.geoPosition.latitude),
                longitude: Number(_postSelected.geoPosition.longitude)
            }))
        }
    }

//---------------------End--------------------------------------//

    const submitHandler = (e) => {
        e.preventDefault()
        console.log('I am from submitHandler')
        console.log(address)
    }

    console.log('-----------End------------')

    return (
        <>
            
        <Row>
            <Col md={6}>
                <Card> 
                <Card.Body>
                    <Row>
                        <Col><h2>Add a new address</h2></Col>
                    </Row>
                <Form onSubmit={submitHandler} autoComplete="nope">                    
                    
                    <Row>
                        {/* Full Name Field */}
                        <Form.Group as={Col} controlId='fullName'>
                            <Form.Label>Full name (First and Last name)</Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required
                                name='fullName' placeholder="Your Full Name"
                                minLength='2' maxLength='25'
                                onChange={(e) => {}}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row>
                        {/* Phone Number Field */}
                        <Form.Label htmlFor='phoneNumber'>Phone Number</Form.Label>
                        <Form.Group as={Col} className="input-group" controlId='phoneNumber'>
                            <span id='phoneCode' className='input-group-text' style={{minWidth: '3rem', paddingLeft: '1.5rem'}}></span>
                            <Form.Control
                                as='input' type='tel' autoComplete='nope' required
                                name='phoneNumber' placeholder="123456789"
                                pattern='[0-9]{5,15}'
                                onChange={(e) => {}}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row>
                        {/* Address Line 1 Field */}
                        <Form.Group as={Col} controlId='addressLine1'>
                            <Form.Label>Street Name/Place Name</Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required
                                name='addressLine1' placeholder="Enter Street Name/Place Name"
                                minLength='2' maxLength='50'
                                onChange={(e) => {}}
                            ></Form.Control>
                        </Form.Group>
                    </Row>
                    
                    <Row>
                        {/* Address Line 2 Field */}
                        <Form.Group as={Col} controlId='addressLine2'>
                            <Form.Label>Building name/no., Floor, Apartment, or villa no.</Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required
                                name='addressLine2' placeholder="Building name/no., Floor, Apartment"
                                minLength='2' maxLength='50'
                                onChange={(e) => {}}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    
                    <Row>
                        {/* Country Field */}
                        <Form.Group as={Col} controlId='countryName'>
                            <Form.Label>Country/Region</Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required autoFocus
                                name='countryName' placeholder='Select Country...'
                                list="countryList"
                                onBlur={(e) => { actionsByCountryChange(e) }}
                            ></Form.Control>
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
                    </Row>

                    <Row>
                        {/* State Field */}
                        <Form.Group as={Col} controlId='stateName'>
                            <Form.Label>State/Province/Region</Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required
                                name='stateName' placeholder="Select State"
                                list='stateList' readOnly={address.countryName === ''}
                                minLength='2' maxLength='20'
                                onBlur={(e) => { actionsByStateChange(e) }}
                            ></Form.Control>
                            <datalist id='stateList'>
                            {states.map(state =>
                                <option
                                    key={JSON.stringify(state)}
                                    id={state.name.toUpperCase()}
                                    value={state.name}
                                    label={state.countryCode + '/' + state.isoCode}
                                >{JSON.stringify(state)}</option>
                            )}
                            </datalist>
                        </Form.Group>
                    </Row>

                    <Row>
                        {/* City Field */}
                        <Form.Group as={Col} md={5} controlId='cityName'>
                            <Form.Label><span>City/Town</span></Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required
                                name='cityName' placeholder="Enter City..."
                                list='cityList' readOnly={address.stateName === ''}
                                minLength='2' maxLength='20'
                                onBlur={(e) => { actionsByCityChange(e) }}
                            ></Form.Control>
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
                        {/* Post Code Field */}
                        <Form.Group as={Col} md={7} controlId='postCode'>
                            <Form.Label>Postal Code/ZIP</Form.Label>
                            <Form.Control
                                as='input' type='text' autoComplete="nope" required
                                name='postCode' placeholder="Enter Post Code"
                                list='postList' readOnly={address.stateName === ''}
                                onBlur={(e) => { actionsByPostChange(e) }}
                            ></Form.Control>
                            <datalist id='postList'>
                            {posts.map(post => 
                                <option
                                key={post.objectId}
                                id={post.postalCode.toUpperCase()}
                                value={post.postalCode}
                                label={post.adminName1 + ' / ' + post.adminName2 + ' / ' +  post.placeName}
                            >{JSON.stringify(post)}</option>
                            )}
                            </datalist>
                        </Form.Group>
                    </Row>

                    <Row>
                        {/* Button Field */}
                        <Col md={6}>
                            <Button type='submit' className='btn-sm' variant='primary'
                            style={{marginTop: '1rem'}}>Confirm Address</Button>
                        </Col>
                    </Row>
                </Form>
                </Card.Body>
                </Card>
            </Col>
            <Col md={6}></Col>
        </Row>
    </>
    )
}

export default CountrySelectScreen

//////////////////////////////////////


    // countries.map(country => {
    //     const state = State.getStatesOfCountry(country.isoCode)
    //     if(state.length === 0) {
    //         console.log(country.name)
    //     }
    // })

    // placeName = String() and return Array() with Json Object()
    // const getPostcodesByPlaces = async (placeName='') => {

    //     const { status, result } = await postcodes.places(placeName, { limit: 100 })
    //     console.log('getPostcodesByPlaces -> ')
    //     console.log(result)
    //     if (Array.isArray(result)) {
    //         return result
    //     } else {
    //         return []
    //     }
    // }
    // location = { latitude: Number(), longitude: Number() } and return Array() with Json Object()
    // const getPostcodesByLocation = async (location={}) => {
        
    //     const { status, result } = await postcodes.geo( location.latitude,  location.longitude,
    //         { limit: 100, radius: 10000000, wideSearch: true } )
    //     console.log('getPostcodesByLocation -> ')
    //     console.log(result)
    //     if (Array.isArray(result)) {
    //         return result
    //     } else {
    //         return []
    //     }
    // }