import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha("#1976d2", 0.15),
    '&:hover': {
        backgroundColor: alpha("#1976d2", 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function Sites() {
    let history = useHistory();
    const [SiteList, setSiteList] = useState([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(5)
    const [search, setSearch] = useState("")
    const [searchText, setSearchText] = useState("")
    const [order, setOrder] = useState("asc")

    useEffect(() => {
        if (history && history.location.state) {
            if (history.location.state.page) {
                setPage(history.location.state.page)
            }
            if (history.location.state.search) {
                setSearch(history.location.state.search)
                setSearchText(history.location.state.search)
            }
        }
    }, [])

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        let start = 0;
        if (page > 1) {
            start = (page - 1) * 5;
        }
        let url = `${apiUrl}/sites?_start=${start}&_limit=5&_sort=title&_order=${order}`;
        if (search) {
            url = url + `&title_like=${search}`
        }
        axios.get(url)
            .then(res => {
                setCount(Math.round(Number(res.headers['x-total-count']) / 5))
                setSiteList(res.data)
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
    }, [page, search, order])

    const handleChange = (event, value) => {
        setPage(value);
        history.replace({
            pathname: "/",
            state: {
                page: value,
                search: search
            }
        })
    };

    const handleSearch = (event) => {
        var code = event.keyCode ? event.keyCode : event.which;
        if (code == 13) {
            //Enter keycode
            setSearch(event.target.value);
            history.replace({
                pathname: "/",
                state: {
                    page: page,
                    search: event.target.value
                }
            })
        }
    };

    return (
        <>
            <Divider style={{ background: "#555" }} />
            <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ textAlign: "center", background: "#1976d2", color: "#fff", padding: 1 }}
            >
                Sites
            </Typography>
            <Divider style={{ background: "#000" }} />
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    value={searchText}
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(event) => setSearchText(event.target.value)}
                    onKeyPress={(event) => handleSearch(event)}
                />
            </Search>
            <Typography sx={{ textAlign: "center", marginTop: 1.5 }}>
                Sort By Title
                <Button variant="text" color="primary" disabled={order == "asc"} onClick={() => setOrder("asc")}>ASC</Button>
                <Button variant="text" color="primary" disabled={order == "desc"} onClick={() => setOrder("desc")}>DESC</Button>
            </Typography>
            {(!SiteList.length && search) ?
                <center><p>Data Not Found!</p></center>
                : (!SiteList.length) ? <center><CircularProgress /></center>
                    :
                    <>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {
                                SiteList.map((site, index) => {
                                    return <>
                                        <ListItem
                                            key={site.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label="comments"
                                                    onClick={() => history.push({
                                                        pathname: "/sites/" + site.id,
                                                        state: {
                                                            page: page,
                                                            search: search
                                                        }
                                                    })}>
                                                    <ArrowForwardIosIcon />
                                                </IconButton>
                                            }
                                        >
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
                                        <Divider />
                                    </>
                                })
                            }
                        </List>
                        <Pagination
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 15
                            }}
                            count={count}
                            page={page}
                            color="primary"
                            onChange={handleChange}
                        />
                    </>
            }
        </>
    );
}
