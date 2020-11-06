import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core"
import '../Components-css/InfoBox.css'

function InfoBox({title,active,cases,total,...props}) {
    return (
        <Card className={`InfoBox ${active && `InfoBox--selected--${props.type}`}`}  onClick={props.onClick}>
            <CardContent>
                <Typography className = "InfoBox__title" color="textSecondary" >
                    {title}
                </Typography>
                <h2 className={`InfoBox__${props.type}`} >{cases}</h2>
                <Typography className ="InfoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
