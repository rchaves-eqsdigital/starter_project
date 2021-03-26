import { Item } from './item';

export class User implements Item {
    private Pic: String; // Base64 Encoded
    private Name: String;
    private Email: String;
    private ID: String;

    constructor(pic: String, name: String, email: String, id: String) {
        this.Pic = pic;
        this.Name = name;
        this.Email = email;
        this.ID = id;
    }

    /**
     * getPic
     */
    public getPic(): String {
        return this.Pic === null ? "" : this.Pic;
    }

    /**
     * getName
     */
    public getName(): String {
        return this.Name;
    }

    /**
     * getEmail
     */
    public getEmail(): String {
        return this.Email;
    }

    /*** Item interface implementations ***/
    /**
     * getTitle
     */
    public getTitle(): String {
        return this.getName()
    }

    /**
     * getTitle
     */
    public getBody(): String {
        return this.getEmail()
    }

    /**
     * getID
     */
    public getID(): String {
        return this.ID;
    }
}