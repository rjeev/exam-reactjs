import React from 'react'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LogoutIcon from "@mui/icons-material/Logout";



const Nav = () =>{
    return (
        <List>
        <a href="/profile">
          <ListItem
            button
          >
            <ListItemIcon>
              <PersonOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          </a>
          {/* <ListItem
            button
            onClick={() => navigate("/ubt/sets", "/ubt/sets")}
          >
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            <ListItemText primary="UBT Questions" />
          </ListItem> */}
           <a href="/cbt/sets">
          <ListItem
            button
          >
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            <ListItemText primary="CBT Questions" />
          </ListItem>
          </a>
          <a href="/logout">
          <ListItem>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
          </a>
        </List>
  
    )
}

export default Nav;
