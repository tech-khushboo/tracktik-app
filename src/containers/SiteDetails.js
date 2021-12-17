import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function SiteDetails({ match }) {
    let history = useHistory();
    const [site, setSite] = useState()
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        axios.get(`${apiUrl}/sites/${match.params.id}`)
            .then(res => {
                setSite(res.data)
            }).catch(error => {
                console.log("error", error)
                history.push({
                    pathname: "/",
                    state: {
                        page: 1,
                        search: ""
                    }
                })
            })
    }, [])
    if (!site) {
        return <center><CircularProgress /></center>
    }

    return (
        <>
            <Divider style={{ background: "#555" }} />
            <List sx={{ width: '100%', background: "#1976d2", color: "#fff" }}>
                <ListItem
                    alignItems="flex-start"
                >
                    <IconButton
                        style={{ color: "#fff", margin: "auto" }}
                        edge="end"
                        aria-label="comments"
                        onClick={() => history.push({
                            pathname: "/sites",
                            state: history.location.state
                        })}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <ListItemAvatar>
                        <Avatar style={{ background: "#fff", color: "#000", width: 60, height: 60, marginRight: 15, border: "solid 1px" }} alt={site.title} src={`"${site.images && site.images[0]}"`} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={site.title}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {`${site.address.street}`}<br />
                                    {`${site.contacts.main.firstName} ${site.contacts.main.lastName}`}
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </List>
            <List sx={{ width: '100%', height: 200 }}>
                <img style={{ height: "inherit", width: "inherit" }} src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><line x1='0' y1='0' x2='100' y2='100' stroke='black' vector-effect='non-scaling-stroke'/><line x1='0' y1='100' x2='100' y2='0' stroke='black' vector-effect='non-scaling-stroke'/></svg>" />
            </List>
            <List sx={{ width: '100%', padding: 0 }}>
                <Divider style={{ background: "#000" }} />
                <ListItem>
                    <ListItemIcon sx={{ color: "#000" }}><PersonIcon /></ListItemIcon>
                    <ListItemText primary={`${site.contacts.main.firstName} ${site.contacts.main.lastName}`} secondary={site.contacts.main.jobTitle} />
                </ListItem>
                <ListItem>
                    <ListItemIcon sx={{ color: "#000" }}><PhoneIcon /></ListItemIcon>
                    <ListItemText primary={site.contacts.main.phoneNumber} />
                </ListItem>
                <ListItem>
                    <ListItemIcon sx={{ color: "#000" }}><MailIcon /></ListItemIcon>
                    <ListItemText primary={site.contacts.main.email} />
                </ListItem>
                <ListItem>
                    <ListItemIcon sx={{ color: "#000" }}><LocationOnIcon /></ListItemIcon>
                    <ListItemText
                        primary="Address Info"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {site.address.street},<br />
                                    {`${site.address.city}, ${site.address.state}, ${site.address.country}`}<br />
                                    Zip Code: {site.address.zipCode}
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </List>
        </>
    );
}
