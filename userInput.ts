import * as readline from "readline";
import { Guid } from "./guid";

export interface IProgramParameters {
    xLeftMost: number;
    yTopMost: number;
    imgPath: string;
    ditherTheImage: boolean;
    fingerprint: string;
    constantWatch: boolean;
    doNotOverrideColors: number[];
    customEdgesMapImagePath: string;
}

class UserInput {
    public currentParameters?: IProgramParameters;

    public async gatherProgramParameters(): Promise<void> {
        if (process.argv[2]) {
            return this.parseParametersFromArguments();
        } else {
            const rl: readline.Interface = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            return this.parseParametersFromInput(rl)
                .then(() => rl.close())
                .catch(() => rl.close());
        }
    }

    private parseParametersFromArguments() {
        const args = process.argv.slice(2);

        let xLeftMost: number;
        if (args[0]) {
            xLeftMost = parseInt(args[0], 10);
            // tslint:disable-next-line: no-console
            console.log("x=" + xLeftMost);
        } else {
            throw new Error("X value is not provided");
        }

        let yTopMost: number;
        if (args[1]) {
            yTopMost = parseInt(args[1], 10);
            // tslint:disable-next-line: no-console
            console.log("y=" + yTopMost);
        } else {
            throw new Error("Y value is not provided");
        }

        let imgPath: string;
        if (args[2]) {
            imgPath = args[2];
            // tslint:disable-next-line: no-console
            console.log("imgPath=" + imgPath);
        } else {
            throw new Error("Path to image is not provided");
        }

        let ditherTheImage: boolean = false;
        if (args[3]) {
            ditherTheImage = args[3].toLowerCase() === "y";
        }
        // tslint:disable-next-line: no-console
        console.log("Dither the image=" + ditherTheImage);

        let constantWatch: boolean = false;
        if (args[4]) {
            constantWatch = args[4].toLowerCase() === "y";
        }
        // tslint:disable-next-line: no-console
        console.log("constantWatch=" + constantWatch);

        const doNotOverrideColors: number[] = [];
        if (args[5]) {
             const inColorsStrArr = args[5].split(",");
             inColorsStrArr.forEach((el) => {
                doNotOverrideColors.push(parseInt(el, 10));
             });
        }

        const fingerprint = Guid.newGuid();

        let customEdgesMapImagePath: string = "";
        if (args[6]) {
            customEdgesMapImagePath = args[6];
            // tslint:disable-next-line: no-console
            console.log("customEdgesMapImagePath=" + customEdgesMapImagePath);
        }

        this.currentParameters = {
            constantWatch,
            customEdgesMapImagePath,
            ditherTheImage,
            doNotOverrideColors,
            fingerprint,
            imgPath,
            xLeftMost,
            yTopMost,
        };
    }

    private async parseParametersFromInput(rl: readline.Interface) {
        const xLeftMost = await this.readNumber(rl, "TopLeft x: ");

        const yTopMost = await this.readNumber(rl, "TopLeft y: ");

        const imgPath = await this.readString(rl, "Path to an image: ");

        let tmpStr = await this.readString(rl, "Dither the image? [default=n] (y/n): ");
        const ditherTheImage: boolean = tmpStr.toLowerCase() === "y";

        tmpStr = await this.readString(rl, "Continue watching for changes after script finishes (grief fix mode)? [default=n] (y/n): ");
        const constantWatch: boolean = tmpStr.toLowerCase() === "y";

        const doNotOverrideColors: number[] = [];
        tmpStr = await this.readString(rl, "Do not paint over colors list (\"script-collab mode\"): [default=NONE] ('2,3,12,23'): ");
        const inColorsStrArr = tmpStr.split(",");
        inColorsStrArr.forEach((el) => {
            doNotOverrideColors.push(parseInt(el, 10));
        });

        const fingerprint = Guid.newGuid();

        const customEdgesMapImagePath = await this.readString(rl, "[Optional] Provide with custom edges drawing map (Greyscale image showing how to draw the image): ");

        this.currentParameters = {
            constantWatch,
            customEdgesMapImagePath,
            ditherTheImage,
            doNotOverrideColors,
            fingerprint,
            imgPath,
            xLeftMost,
            yTopMost,
        };
    }

    private async readString(rl: readline.Interface, question: string): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            rl.question(question, (str: string) => {
                resolve(str);
                return;
            });
        });
        return promise;
    }

    private async readNumber(rl: readline.Interface, question: string): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            rl.question(question, (numStr: string) => {
                const num = parseInt(numStr, 10);
                if (isNaN(num)) {
                    reject("invalid number");
                    return;
                }
                resolve(num);
                return;
            });
        });
        return promise;
    }
}

export default new UserInput();
