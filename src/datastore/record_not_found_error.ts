class RecordNotFoundError implements Error {
    public name: string = "RecordNotFoundError";
    public message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export = RecordNotFoundError;
