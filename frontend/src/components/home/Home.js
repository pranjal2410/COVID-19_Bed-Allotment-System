import React from "react";
import {Typography} from "@material-ui/core";
import {getToken} from "../authentication/cookies";
import jwtDecode from "jwt-decode";
import Hospitals from "../hospital/Hospitals";
import StaffPanel from "../staff/StaffPanel";

const Home = () => {
    let token = getToken();
    const is_staff = getToken() ==='' ? false : jwtDecode(token).is_staff;

    if(token !== '') {
        if(is_staff===true){
            return <StaffPanel/>
        }
        return <Hospitals/>
    }

    return (
        <Typography paragraph>
        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
        facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
        tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
        consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
        vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
        hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
        tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
        nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
        accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
    </Typography>
    )
}

export default Home;