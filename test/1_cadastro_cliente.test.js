const webdriver = require('selenium-webdriver');
const {getElementById, getElementByClass, getElementByCss, getElementsByCss} = require('../utils')
const randomEmail = require('random-email');
const fsLibrary  = require('fs');
const s = fsLibrary.createReadStream("user.txt");

describe('Cadastro Usuario', () => {
  let driver;
  let email;

  beforeAll(async () => {
    driver = new webdriver.Builder().forBrowser('chrome').build();

    // eslint-disable-next-line no-undef
    await driver.get(`http://automationpractice.com/index.php`);
  }, 100000);

  afterAll(async () => {
    await driver.quit();
  }, 100000);

  test("Cadastro Cliente Existente", async () =>{
    const lnk = await getElementByClass(driver, 'login');
    await lnk.click();

    const lnk1 = await getElementById(driver, 'email_create');
    const wrong_email = await s.read().toString();
    await lnk1.sendKeys(wrong_email);

    const inpf = await getElementById(driver, 'SubmitCreate');
    await inpf.click();

    const message_alert = await getElementByCss(driver, '.alert-danger > ol > li');
    await expect(await message_alert.getText()).toEqual("An account using this email address has already been registered. Please enter a valid password or request a new one.");
  }, 15000);

  test("Tela Inicial Inicio Cadastro", async () =>{
    const lnk = await getElementByClass(driver, 'login');
    await lnk.click();

    const lnk1 = await getElementById(driver, 'email_create');
    email = randomEmail();
    await lnk1.sendKeys(email);

    const inpf = await getElementById(driver, 'SubmitCreate');
    await inpf.click();
    }, 15000);

  test("Penchimento Informações Pessoais", async () =>{
    const gnr = await getElementById(driver, 'id_gender1');
    await gnr.click();

    const firstName = await getElementById(driver, 'customer_firstname');
    await firstName.sendKeys("Paulo");

    const LastName = await getElementById(driver, 'customer_lastname');
    await LastName.sendKeys("Melo");

    const bdayDay = await getElementByCss(driver, '#days > option:nth-child(4)');
    await bdayDay.click();

    const bdayMonth = await getElementByCss(driver, '#months > option:nth-child(10)');
    await bdayMonth.click();

    const bdayYear = await getElementByCss(driver, '#years > option:nth-child(26)');
    await bdayYear.click();

    const psswd = await getElementByCss(driver, '#passwd');
    await psswd.sendKeys("bolinha123");
  }, 20000);

  test("Validação campos Obrigatórios", async () =>{
    const clickBtn = await getElementById(driver, 'submitAccount');
    await clickBtn.click();

    const required = await getElementByCss(driver, '.alert-danger > p');
    await expect(await required.getText()).toEqual("There are 5 errors");

    const text_required = await getElementsByCss(driver, '.alert-danger > ol > li');

    const arrayLength = await text_required.length;
    for (let i = 0; i < arrayLength; i++) {
      switch (i){
        case 0:
          await expect(await text_required[i].getText()).toEqual("You must register at least one phone number.");
          break;
        case 1:
          await expect(await text_required[i].getText()).toEqual("address1 is required.");
          break;
        case 2:
          await expect(await text_required[i].getText()).toEqual("city is required.");
          break;
        case 3:
          await expect(await text_required[i].getText()).toEqual("The Zip/Postal code you've entered is invalid. It must follow this format: 00000");
          break;
        case 4:
          await expect(await text_required[i].getText()).toEqual("This country requires you to choose a State.");
          break;
      }
    }
  }, 30000);

  test("Penchimento Endereço", async () =>{
    const psswd = await getElementByCss(driver, '#passwd');
    await psswd.sendKeys("bolinha123");

    const firstNameAddress = await getElementById(driver, 'firstname');
    driver.executeScript("arguments[0].scrollIntoView()", firstNameAddress);
    driver.sleep(500);
    await firstNameAddress.sendKeys("Paulo");

    const lastNameAddress = await getElementById(driver, 'lastname');
    await lastNameAddress.sendKeys("Melo");

    const company = await getElementById(driver, 'company');
    await company.sendKeys("Linx");

    const adress = await getElementById(driver, 'address1');
    await adress.sendKeys("Rua Marli Pereira dos Santos, 394");

    const city = await getElementById(driver, 'city');
    await city.sendKeys("Itu");

    const state = await getElementByCss(driver, '#id_state > option:nth-child(4)');
    await state.click();

    const postCode = await getElementById(driver, 'postcode');
    await postCode.sendKeys("12957");

    const comment = await getElementById(driver, 'other');
    await comment.sendKeys("Quero ser Linx");

    const phone = await getElementById(driver, 'phone');
    await phone.sendKeys("11978023222");

    const mobilePhone = await getElementById(driver, 'phone_mobile');
    await mobilePhone.sendKeys("11978023222");

    const alias = await getElementById(driver, 'alias');
    await alias.sendKeys("Rua Atilio Lui, 228");

    const clickBtn = await getElementById(driver, 'submitAccount');
    await clickBtn.click();
    }, 15000);

  test("Validação de Cadastro", async () =>{
    fsLibrary.writeFileSync("user.txt",email,{encoding:'utf8',flag:'w'});
    const success = await getElementByCss(driver, '.info-account');
    await expect(await success.getText()).toEqual("Welcome to your account. Here you can manage all of your personal information and orders.");

    const user_info = await getElementByCss(driver, '.icon-user');
    await user_info.click();

    const email_info = await getElementById(driver, 'email');
    await expect(await email_info.getAttribute("value")).toEqual(email);
  }, 30000);
});


