const webdriver = require('selenium-webdriver');
const { until } = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const {getElementById, getElementByClass, getElementByCss} = require('../utils');
const fsLibrary  = require('fs');
const {getElementsByCss} = require("../utils");
const {LoginStep} = require("../utils");

describe('Compra de Produto', () => {
    let driver;
    let paymentMethod;

    beforeAll(async () => {
        driver = new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(`http://automationpractice.com/index.php`);
    }, 100000);

    afterAll(async () => {
        await driver.quit();
    }, 100000);

    test("Realiza Login", async () =>{
        await LoginStep(driver, true);
    }, 30000);

    test("Seleciona Produto", async () =>{
        const lnk = await getElementByClass(driver, 'logo');
        await lnk.click();

        const lnk2 = await getElementByCss(driver, `#block_top_menu > ul > li:nth-child(${Math.floor(Math.random() * (3 - 1 + 1)) + 1})`);
        await lnk2.click();

        const shop_items = await getElementsByCss(driver, `.product_list > li`);
        const items_length = await shop_items.length;

        const lnk3 = await getElementByCss(driver, `.product_list > li:nth-child(${Math.floor(Math.random() * (items_length - 1 + 1)) + 1}) > .product-container > .right-block > h5 > a`);
        await lnk3.click();
    }, 20000);

    test("Opções de compra", async () =>{

        const lnk = await getElementByCss(driver, `#add_to_cart > button`);
        await lnk.click();

        const confirm_btn = await getElementByCss(driver, `.button-medium`);
        await confirm_btn.click();

        const stock = await getElementByCss(driver, `.cart_avail >.label-success`);
        expect(await stock.getText()).toEqual("In stock");

        const checkout_btn = await getElementByCss(driver, `.standard-checkout`);
        await checkout_btn.click();

        const address = await getElementByCss(driver, `.address_delivery > label`);
        expect(await address.getText()).toEqual("Choose a delivery address:");

        const continue_btn = await getElementByCss(driver, `.cart_navigation > button`);
        await continue_btn.click();

        const terms = await getElementByCss(driver, `.order_carrier_content > .carrier_title`);
        expect(await terms.getText()).toEqual("Terms of service");

        const lnk5 = await getElementByCss(driver, `#uniform-cgv`);
        await lnk5.click();

        const lnk6 = await getElementByCss(driver, `.cart_navigation > button`);
        await lnk6.click();

        const choose_payment = await getElementByCss(driver, `.page-heading`);
        expect(await choose_payment.getText()).toEqual("PLEASE CHOOSE YOUR PAYMENT METHOD");

    }, 40000);

    test("Método de pagamento", async () =>{

        paymentMethod = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        const lnk = await getElementByCss(driver, `#HOOK_PAYMENT > div:nth-child(${paymentMethod})`);
        await lnk.click();

        const lnk6 = await getElementByCss(driver, `.cart_navigation > button`);
        await lnk6.click();

    }, 20000);

    test("Confirmação de Pagamento", async () =>{
        if(paymentMethod == 1)
        {
            const lnk = await getElementByCss(driver, `.cheque-indent`);
            expect(await lnk.getText()).toEqual("Your order on My Store is complete.");
        } else {
            const lnk = await getElementByCss(driver, `.alert`);
            expect(await lnk.getText()).toEqual("Your order on My Store is complete.");
        }
    }, 20000);


});

module.exports = {
    LoginStep: LoginStep,
};


