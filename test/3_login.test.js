const webdriver = require('selenium-webdriver');
const {getElementById, getElementByClass} = require('../utils')
const {LoginStep} = require("../utils");
const {getElementByCss} = require("../utils");

describe('Login', () => {
    let driver;

    beforeAll(async () => {
        driver = new webdriver.Builder().forBrowser('chrome').build();

        await driver.get(`http://automationpractice.com/index.php`);
    }, 100000);

    afterAll(async () => {
        await driver.quit();
    }, 100000);

    test("Realiza Login com credenciais inválidas", async () =>{
        await LoginStep(driver, false);
    }, 15000);

    test("Realiza Login com ùltimo cadastro", async () =>{
        await LoginStep(driver, true);
    }, 15000);
});


