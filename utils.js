const { until } = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const fsLibrary  = require('fs');
const s = fsLibrary.createReadStream("user.txt");

async function getElementById(driver, id, timeout = 5000) {
    const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

async function getElementByClass(driver, classname, timeout = 5000) {
    const el = await driver.wait(until.elementLocated(By.className(classname)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

async function getElementByName(driver, name, timeout = 5000) {
    const el = await driver.wait(until.elementLocated(By.name(name)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

async function getElementByXpath(driver, xpath, timeout = 5000) {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

async function getElementByCss(driver, css, timeout = 5000) {
    const el = await driver.wait(until.elementLocated(By.css(css)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

async function getElementsByCss(driver, css, timeout = 5000) {
    const el = await driver.wait(until.elementsLocated(By.css(css)), timeout);
    return el;
};

async function LoginStep(driver, type) {
    const lnk = await getElementByClass(driver, 'login');
    await lnk.click();

    if (type == true) {
        const lnk1 = await getElementById(driver, 'email');
        const email = await s.read().toString();
        await lnk1.sendKeys(email);
    } else {
        const lnk1 = await getElementById(driver, 'email');
        await lnk1.sendKeys("emailErrado@gmail.com");
    }

    const psswd = await getElementById(driver, 'passwd');
    await psswd.sendKeys("bolinha123");

    const inpf = await getElementById(driver, 'SubmitLogin');
    await inpf.click();

    if(type == false) {
        const failed = await getElementByCss(driver, ".alert-danger > ol > li");
        await expect(await failed.getText()).toEqual("Authentication failed.");
    }
}

module.exports = {
    getElementById: getElementById,
    getElementByClass: getElementByClass,
    getElementByCss: getElementByCss,
    getElementsByCss: getElementsByCss,
    getElementByName: getElementByName,
    getElementByXpath: getElementByXpath,
    LoginStep: LoginStep
};