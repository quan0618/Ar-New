import React, { useEffect } from 'react'
import { InputGroup, FormControl, Container } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import ArToast from '../components/ArToast';
import { API, graphqlOperation } from 'aws-amplify';
import { getArAZCustomerCode } from '../graphql/queries';
import { v4 as uuidv4 } from 'uuid';
import { createArCustomer } from '../graphql/mutations';
import { green } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 200,
    },
    content: {
        textAlign: 'center',
        maxWidth: '50%',
        margin: 'auto'

    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    rootl: {
        maxWidth: '100%'
    },
    card1: {
        maxWidth: '50%',
        minWidth: '50%',
        width: '50%',
    },
    card2: {
        maxWidth: '100%'
    },
    table: {
        minWidth: 700,
    },
    right: {
        position: 'absolute',
        right: '25%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '20ch',
    },
    textFieldNm: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '60ch',
    },
    textKField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '60ch',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    // avatar: {
    //   backgroundColor: red[500],
    // },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

let CustomerAccountGroup = "";
let HonorificTitleKey = "";
let name1 = "";
let name2 = "";
let name3 = "";
let SearchTerm = "";
let PlaceName = "";
let PostCode = "";
let CountryCode = "";
let LanguageCode = "";
let FirstPhoneNumber = "";
let agencyId = "";
export default function AddAddress() {
    const [toast, setToast] = React.useState({ open: false, message: "send Email success", severity: "error" });
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();
    const location = useLocation();
    useEffect(() => {
        agencyId = location.state.CustomerCodeKey;
        console.log("agencyId:", agencyId)
        if (agencyId === '' || agencyId === undefined) {
            setToast({
                open: true,
                message: 'error',
                severity: 'error'
            })
        }
    }, []);

    const handleCreateAddress = () => {
        setLoading(true);
        let errorMsg = "";
        if (CustomerAccountGroup === '') {
            errorMsg = "　※得意先勘定グループ を入力してください";
        } else if (HonorificTitleKey === '') {
            errorMsg = "　※敬称キーを入力してください";
        }
        else if (name1 === '') {
            errorMsg = "　※名称1を入力してください";
        }
        else if (name2 === '') {
            errorMsg = "　※名称2を入力してください";
        }
        else if (name3 === '') {
            errorMsg = "　※名称3を入力してください";
        }
        else if (SearchTerm === '') {
            errorMsg = "　※検索語句1を入力してください";
        }
        else if (PlaceName === '') {
            errorMsg = "　※地名を入力してください";
        }
        else if (PostCode === '') {
            errorMsg = "　※郵便番号を入力してください";
        }
        else if (CountryCode === '') {
            errorMsg = "　※国コードを入力してください";
        }
        else if (LanguageCode === '') {
            errorMsg = "　※言語コードを入力してください";
        }
        else if (FirstPhoneNumber === '') {
            errorMsg = "　※電話番号を入力してください";
        }
        if (errorMsg !== '') {
            setToast({
                open: true,
                message: errorMsg,
                severity: "error"
            })
            setLoading(false);
            return
        }
        createAddress();
    }
    const createAddress = async () => {
        let ArAzInfo = await API.graphql(graphqlOperation(getArAZCustomerCode, { id: '1' }));
        console.log("ArAzInfo", ArAzInfo)
        let codeNumber = ArAzInfo.data.getArAZCustomerCode['CustomerCodeNumber'];
        let initialCode = 'AZ00000001';
        initialCode = initialCode.slice(0, initialCode.length - codeNumber.toString().length) + codeNumber
        await API.graphql(graphqlOperation(createArCustomer, {
            input: {
                id: uuidv4(),
                CustomerCodeKey: agencyId,
                AccounKey: 'SH',
                CustomerCode: initialCode,
                CustomerAccountGroup: CustomerAccountGroup,
                HonorificTitleKey: HonorificTitleKey,
                Name1: name1,
                Name2: name2,
                Name3: name3,
                SearchTerm1: SearchTerm,
                PlaceName: PlaceName,
                PostCode: PostCode,
                CountryCode: CountryCode,
                Area: '13：東京都',
                LanguageCode: LanguageCode,
                FirstPhoneNumber: FirstPhoneNumber
            }
        }));
        setLoading(false);
        history.back();
    }

    return (
        <Container style={{ 'minWidth': '85vw', 'minHeight': '74vh', textAlign: 'center' }} >
            <div className={classes.content} >
                <div >

                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">得意先勘定グループ</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=" "
                            aria-describedby="basic-name"
                            id="CustomerAccountGroup"
                            className={classes.textField}
                            onChange={(e) => { CustomerAccountGroup = e.target.value }}
                            maxLength="4"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">敬称キー</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="HonorificTitleKeyDialog"
                            className={classes.textField}
                            onChange={(e) => {
                                HonorificTitleKey = e.target.value
                            }}
                            maxLength="4"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">名称1</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="Name1Dialog"
                            className={classes.textField}
                            onChange={(e) => { name1 = e.target.value }}
                            maxLength="40"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">名称2</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="Name2Dialog"
                            className={classes.textField}
                            onChange={(e) => { name2 = e.target.value }}
                            maxLength="40"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">名称3</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="Name3Dialog"
                            className={classes.textField}
                            onChange={(e) => { name3 = e.target.value }}
                            maxLength="40"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">検索語句1</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="SearchTerm1Dialog"
                            className={classes.textField}
                            onChange={(e) => { SearchTerm = e.target.value }}
                            maxLength="20"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">地名</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="PlaceNameDialog"
                            className={classes.textField}
                            onChange={(e) => { PlaceName = e.target.value }}
                            maxLength="60"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">市区町村の郵便番号</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="PostCodeDialog"
                            className={classes.textField}
                            onChange={(e) => { PostCode = e.target.value }}
                            maxLength="10"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">国コード</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="CountryCodeDialog"
                            className={classes.textField}
                            onChange={(e) => { CountryCode = e.target.value }}
                            maxLength="3"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">地域 (都道府県)</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="AreaDialog"
                            className={classes.textField}
                            value="13：東京都"
                            readOnly={true}
                            maxLength="20"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">言語コード</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="LanguageCodeDialog"
                            className={classes.textField}
                            onChange={(e) => { LanguageCode = e.target.value }}
                            maxLength="1"
                        />
                    </InputGroup>
                    <div style={{ display: 'flex' }}>

                    </div>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={classes.textField} id="basic-name">電話番号</InputGroup.Text>
                        <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-name"
                            id="FirstPhoneNumberDialog"
                            className={classes.textField}
                            onChange={(e) => { FirstPhoneNumber = e.target.value }}
                            maxLength="30"
                        />
                    </InputGroup>
                    <div className={classes.right}>
                        <div className={classes.wrapper}>
                            <Button color='primary' variant='contained' onClick={handleCreateAddress} disabled={loading}>登録</Button>
                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </div>
                </div>
                <ArToast open={toast.open} message={toast.message} autoHideDuration={1500} severity={toast.severity} handleClose={() => {
                setToast({ open: false })
            }} />
            </div>
        </Container>
    )
}
