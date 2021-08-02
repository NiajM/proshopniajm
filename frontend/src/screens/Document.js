import axios from 'axios'
import path from 'path'
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import PDFReader from '../components/pdfs/PDFReader.jsx'

const Document = ({ match, history }) => {
    
    const [pdf1, setPdf1] = useState('/images/images.pdf')
    const [pdf2, setPdf2] = useState('/uploads/uploads.pdf')
    const [uploading, setUploading] = useState(false)

    console.log('This is dirname in Document->')
    console.log(__dirname)
    console.log(path.resolve())

    //const image1 = 'http://127.0.0.1:3000/images/sample.png'

    const image1 = 'http://127.0.0.1:5000/images/images.png'
    const image2 = '/images/images.png'
    const image3 = 'http://127.0.0.1:5000/uploads/uploads.png'
    const image4 = '/uploads/uploads.png'
    
    //const pdf1 = 'http://127.0.0.1:5000/uploads/sample1.pdf'
    //const pdf1 = '/pdf/pdf.pdf'
    //const pdf2 = '/uploads/uploads.pdf'
    //const pdf2 = '/images/sample.pdf'

    useEffect(() => {
    }, [])

    const uploadFileHandler = async (e) => {    // async is for http request

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('pdf', file)
        setUploading(true)

        // console.log(Array.from(formData))

        // for (let obj of formData) {
        //     console.log(obj)  
        // }

        // document.getElementById('iFrame3').textContent = JSON.stringify(Array.from(formData), '\t', 2)
        
        try {
            //This is must important to uploading image
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            //const { data } = await axios.post('/api/upload/pdf', formData, config)
            const { data } = await axios.post('/api/upload/pdf', formData, config)

            console.log(`data.hostPath-> ${data.hostPath}`)
            console.log(`data.dirPath-> ${data.dirPath}`)
            console.log(`data.fullPath-> ${data.fullPath}`)

            setPdf1(data.dirPath)
            setPdf2(data.dirPath)

            //setImage(data.replace(/\\/g, '/').split('public')[1])
            setUploading(false)

        } catch (error) {
            console.log(`This is error->${error}`)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log('Submitted')
    }

    const changeDocument = (e) => {

        e.preventDefault()

        const image1 = document.getElementById('image1')
        console.log(new URL(image1.src))

        const image2 = document.getElementById('image2')
        console.log(new URL(image2.src))

        const image3 = document.getElementById('image3')
        console.log(new URL(image3.src))

        const image4 = document.getElementById('image4')
        console.log(new URL(image4.src))

        const iFrame1 = document.getElementById('iFrame1')
        console.log(new URL(iFrame1.src))

        const iFrame2 = document.getElementById('iFrame2')
        console.log(new URL(iFrame2.src))
    }
    return (
    <>
        {/* Image 1/2 */}
        <Row>
            <Col>
                {/* <a href={image1} target="_blank" rel="noreferrer noopener">{image1}</a> */}
                {/* <a href={image1} target='_blank' rel='noopener'>{image1}</a> */}
                <a href={image1}>{image1}</a>
                <Card.Img id='image1' src={image1} variant='top' />
            </Col>
            <Col>
                <a href={image2}>{image2}</a>
                <Card.Img id='image2' src={image2} variant='top' />
            </Col>
        </Row>
        {/* Image 3/4 */}
        <Row>
            <Col>
                <a href={image3}>{image3}</a>
                <Card.Img id='image3' src={image3} variant='top' />
            </Col>
            <Col>
                <a href={image4}>{image4}</a>
                <Card.Img id='image4' src={image4} variant='top' />
            </Col>
        </Row>
        {/* Form/Button */}
        <Row>
            <Col>
                <Button type='button' onClick={changeDocument}>
                    Get Document
                </Button>
            </Col>
            
                <FormContainer>
                    <Form onSubmit={submitHandler}>
            <Col>
                        {/* PDF Field */}
                        <Form.Group controlId='pdf'>
                            {/* For PDF uploading */}
                            <Form.File
                                id='pdf-file'
                                custom
                                onChange={uploadFileHandler}>
                            </Form.File>
                            {uploading && <Loader />}
                            {/* {/* For Image uploading */}
                        </Form.Group>
            </Col>
            <Col>
                        {/* Button to send the Request */}
                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
            </Col>
                    </Form>
                </FormContainer>
        </Row>
        {/* iframe1/2 */}
        <Row>
            <Col>
                <a href={pdf1}>{pdf1}</a>
                <iframe id='iFrame1' src={pdf1} target='_blank' title='title1' style={{ width: '100%', height: '500px' }} ></iframe>
            </Col>
            <Col>
                <a href={pdf2}>{pdf2}</a>
                <iframe id='iFrame2' src={pdf2} target='http://127.0.0.1:5000/uploads/sample1.pdf' title='title2' style={{ width: '100%', height: '500px' }} ></iframe>
            </Col>
        </Row>
        {/* PDFReader */}
        <Row>
            <Col>
                <h2>{pdf1}</h2>
                <div className="readPdf">
                    {<PDFReader viewedPdf={pdf1} />}
                </div>
            </Col>
            <Col>
                <h2>{pdf2}</h2>
                <div className="readPdf">
                    {<PDFReader viewedPdf={pdf2} />}
                </div>
            </Col>
        </Row>
    </>
    )
}

export default Document
