import axios from "axios";
import { prismaclient } from "../../client/db";
import JWTService from "../../services/jwt";

interface GoogleTokenResult {
    iss?: String;
    nbf?: String;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
  }

const queries = {
    verifyGoogleToken : async (parent : any , {token} : {token : string}) => {

        const googleToken = token;

        const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOAuthURL.searchParams.set('id_token',googleToken);

        const {data} = await axios.get<GoogleTokenResult>(googleOAuthURL.toString() , {
            responseType : 'json',
        })

        //check for user in db
        const user = await prismaclient.user.findUnique({
            where : { email : data.email }
        })

        if(!user){
            await prismaclient.user.create({
                data : {
                    email : data.email,
                    firstName : data.given_name,
                    lastName : data.family_name,
                    profileImageURL : data.picture
                }
            });
        }

        const userInDB = await prismaclient.user.findUnique({where : { email : data.email}});
        if(!userInDB) throw new Error("User with the email not found");

        const userToken = JWTService.generateTokenFOrUser(userInDB);

        return userToken;
    }
}

export const resolvers = {queries};