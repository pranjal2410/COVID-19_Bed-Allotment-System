import React, {useEffect,useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fade from "@material-ui/core/Fade";
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { lightBlue } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";
import { useSnackbar } from "notistack";
import {getToken} from "../authentication/cookies";
import DateFnsUtils from "@date-io/date-fns";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
      root: {
        padding: '20px',
        width: '100%'
      },
      saveButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
      editButton: {
        position: 'absolute',
        right: theme.spacing(6),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
      paper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
        width : 250
      },
      bannerBackground: {
        borderRadius: '5px',
        backgroundSize: 'cover',
        display : 'flex',
        justifyContent : 'center',
        backgroundRepeat: 'no-repeat',
    },
    avatar: {
        backgroundColor: lightBlue[900],
        color: 'white',
        width: theme.spacing(15),
        marginBottom : 40,
        boxShadow: theme.shadows[10],
        fontSize: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        height: theme.spacing(15)
    },
    progressBar : {
      display: 'flex',
      '& > * + *': {
          marginLeft: theme.spacing(2),
      },
      justifyContent: 'center',
  } 
  })
);


const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


export default function UserProfile(props) {
  const {open,handleClose} = props;
  const styles = useStyles();
  const [spinner, setSpinner] = useState(true);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [values, setValues] = useState({
      first_name: '',
      last_name: '',
      contact: null,
      email: '',
      birthday: '',
      weight : 0});
  const [editable,setEditable] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({
          nameError: false,
          contactError: false,
          editError: false});
  const setProfileEdit = () => setEditable(editable=>!editable);

  useEffect(()=>{

  },[])
 

  useEffect(() => {
      if(errors.editError){
          setErrors({
              nameError: false,
              contactError: false,
              editError: false})
      }
      axios({
          method: 'GET',
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type" : "application/json",
              "Authorization": `Token ${getToken()}`,
          },
          url: '/portal/patient-details/'
      }).then(res => {
          setValues({
              first_name: res.data.data.first_name,
              last_name: res.data.data.last_name,
              contact: res.data.data.contact,
              email: res.data.data.email,
              birthday: res.data.data.birthday,
              weight: res.data.data.weight,
          });
          handleDateChange(new Date(res.data.birthday));
          return true;
      }).then(val => {
          setSpinner(false);
      }).catch(error => {
          console.log(error);
      })
      }, [open, errors.editError])

      const handleChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    const handleSubmit = () => {
      if (values.first_name === null || values.first_name === '' || values.last_name === null || values.last_name === '') {
          setErrors({...errors, nameError: true})
          return;
      }
      if (values.contact === null || values.contact === '') {
          setErrors({...errors, contactError: true})
          return;
      }
      if(!(errors.nameError || errors.contactError))
      {
          enqueueSnackbar('Sending data....', {variant: "info", key: 'try_edit'})
          axios({
              method: 'POST',
              headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type" : "application/json",
                  "Authorization": `Token ${getToken()}`,
              },
              data: {
                  'first_name': values.first_name,
                  'last_name': values.last_name,
                  'contact': values.contact,
                  'email': values.email,
                  'birthday': selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate(),
                  'weight' : values.weight
              },
              url:  '/portal/patient-details/'
          }).then(response => {
              closeSnackbar('try_edit')
              setErrors({...errors, editError: false});
              handleClose();
              enqueueSnackbar('Profile edited successfully!', { variant: 'success', key: 'edit_success'})
              setTimeout(() => closeSnackbar('edit_success'), 3000);
          }).catch(error => {
              closeSnackbar('try_edit')
              setErrors({...errors, editError: true});
              enqueueSnackbar('Failed to edit profile', { variant: 'error', key: 'edit_error'})
              setTimeout(() => closeSnackbar('edit_error'), 3000)
          })
      }
  }


  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
        <MuiDialogTitle disableTypography className={styles.root}>
          <Typography variant="h6">User Profile</Typography>
          <IconButton aria-label="edit" className={styles.editButton} onClick={setProfileEdit}>
              <EditIcon />
            </IconButton>
            {!editable ?  null : 
            <IconButton aria-label="save" className={styles.saveButton} onClick={handleSubmit}>
              <SaveIcon />
            </IconButton>}
        </MuiDialogTitle>
                <DialogContent dividers>
                <Grid container className={styles.root} spacing={3}>
                  {spinner ? (
                    <Grid item xs={12}>
                      <Typography variant='h4'>Loading your info...</Typography>
                    </Grid>
                  ) : (
                    <React.Fragment>
                    <Fade in={true} timeout={1000}>
                         <Grid item xs={6}>
                           <Paper className={styles.bannerBackground} elevation={0}>
                               <Avatar className={styles.avatar}>H</Avatar>
                           </Paper>
                           <Paper className={styles.paper} elevation={2}>
                             <TextField
                                 id="email"
                                 variant="outlined"
                                 label='Email'
                                 type="text"
                                 defaultValue={values.email}
                                 name="Email"
                                 margin="normal"
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                             <TextField
                                 id="contact"
                                 variant="outlined"
                                 label='Contact'
                                 type="number"
                                 name="Contact"
                                 margin="normal"
                                 defaultValue={values.contact}
                                 autoFocus
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                           </Paper>
                         </Grid>
                     </Fade>
                     <Fade in={true} timeout={1000}>
                     <Grid item xs={6}>
                         <Paper className={styles.paper} elevation={2}>
                             <TextField
                                 id="first_name"
                                 variant="outlined"
                                 label="First Name"
                                 type="text"
                                 defaultValue={values.first_name}
                                 name="first_name"
                                 margin="normal"
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                             <TextField
                                 id="last_name"
                                 variant="outlined"
                                 label="Last Name"
                                 type="text"
                                 name="last_name"
                                 margin="normal"
                                 defaultValue={values.last_name}
                                 autoFocus
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                             <TextField
                                 id="weight"
                                 variant="outlined"
                                 label="Weight"
                                 type="number"
                                 name="Weight"
                                 margin="normal"
                                 defaultValue={values.weight}
                                 autoFocus
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
 
                             <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                 <KeyboardDatePicker
                                     clearable
                                     placeholder="Enter your birth date"
                                     defaultValue={values.birthday}
                                     inputVariant={'outlined'}
                                     minDate={new Date(1950, 5, 1)}
                                     format="MM/dd/yyyy"
                                     label='Birthday'
                                     margin="normal"
                                     style={{ marginLeft: "20px"}}
                                     disabled={!editable}
                                     error={errors.nameError || errors.editError}
                                     helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                     onChange={handleChange}
                                 />
                             </MuiPickersUtilsProvider>
                         </Paper>
                     </Grid>
                     </Fade></React.Fragment>
                  )}
                </Grid>
            </DialogContent>
      </Dialog>
    </div>
  );
}