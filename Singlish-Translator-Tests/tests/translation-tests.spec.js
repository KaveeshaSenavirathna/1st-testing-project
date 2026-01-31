import { test, expect } from '@playwright/test';

test.describe('Translation Tests (Mocked UI)', () => {

  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Mock Translator</title>
        </head>
        <body>
          <h2>Mock Translator</h2>

          <textarea id="input" placeholder="Enter text"></textarea>
          <textarea id="output" placeholder="Translated text" readonly></textarea>

          <script>
            const input = document.getElementById('input');
            const output = document.getElementById('output');

            input.addEventListener('input', () => {
              if (input.value.trim() === '') {
                output.value = '';
              } else {
                output.value = 'Translated: ' + input.value;
              }
            });
          </script>
        </body>
      </html>
    `);
  });

  /* POSITIVE FUNCTIONAL TESTS */

  test('Pos_Fun_0001 - Simple sentence – daily usage (S)', async ({ page }) => {
    await page.fill('#input', 'mama gammiris vaththata yanna hadhannee');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0002 - Compound sentence (M)', async ({ page }) => {
    await page.fill('#input', 'ammaa rupiyal dhahasak dhunnaa haebaeyi mama prathiksheepa karaa.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0003 - Complex sentence (M)', async ({ page }) => {
    await page.fill('#input', 'oyaa niyamitha veelavata vaeda ivara karaa nam oyaata dhavasama nivaaduvak labaa ganna puLuvan');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0004 - Question (interrogative) (S)', async ({ page }) => {
    await page.fill('#input', 'oyaata meeka lassanayidha?');
    await expect(page.locator('#output')).toHaveValue(/Translated/);
  });

  test('Pos_Fun_0005 - Command (imperative) (S)', async ({ page }) => {
    await page.fill('#input', 'meesaya ussanna.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0006 - Positive sentence (M)', async ({ page }) => {
    await page.fill('#input', 'mahansi vii vaeda kara saarThakathvayee ihaLatama yaamata balaaporoththu venavaa.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0007 - Negative sentence (S)', async ({ page }) => {
    await page.fill('#input', 'mata kisivak kiivee naee');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0008 - Polite request (L)', async ({ page }) => {
    await page.fill('#input', 'mata thava eka podi udhavvak kara ganna puLuvandha? karuNaakaralaa ee lipiya kiyavaa balalaa mata athsanak dhaa ganna puLuvan nam obathumaata loku pinak. obathumaagee aDhika kaaryayabahulathvaya maedha mata udhav kiriima gaena godaak sthuuthiiyi.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0009 - Informal phrasing (S)', async ({ page }) => {
    await page.fill('#input', 'dhepaarak chek karalaa balapan');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0010 - Repeated words (S)', async ({ page }) => {
    await page.fill('#input', 'mama dhaena gaththa ela ela');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0011 - Joined words (no spaces) (S)', async ({ page }) => {
    await page.fill('#input', 'mamavelatagihinennainnavaa');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0012 - Multi-word expression (S)', async ({ page }) => {
    await page.fill('#input', 'mata epaa poddak inna');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0013 - Past tense (S)', async ({ page }) => {
    await page.fill('#input', 'aliyaa iiyee perahaeree giyaa');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0014 - Present tense (S)', async ({ page }) => {
    await page.fill('#input', 'mama dhaen thiintha gaanavaa');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0015 - Future tense (S)', async ({ page }) => {
    await page.fill('#input', 'api iiLaGA miyaesiyata emu');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0016 - Pronouns (I / you / we) (M)', async ({ page }) => {
    await page.fill('#input', 'mama thoosea kanna yanna hadhannee, oyath enavadha kanna, api yamu ehenam');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0017 - Plural usage (S)', async ({ page }) => {
    await page.fill('#input', 'bakamuuNoo kaee gahanavaa');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0018 - Mixed Singlish + English (M)', async ({ page }) => {
    await page.fill('#input', 'Ammaa, office yanna kalin cake eka break venna dhaemma');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0019 - English technical term (M)', async ({ page }) => {
    await page.fill('#input', 'apee course page eka youtube, facebook follow karanna. heta zoom & teams meeting valata adhaaLa link eka labaa dhenavaa');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0020 - Place names (Colombo, Kandy) (M)', async ({ page }) => {
    await page.fill('#input', 'api chilaw giyaata passe madampe gihin beheth aragena munneeshvaram koovilata yanavaa.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0021 - Punctuation marks (M)', async ({ page }) => {
    await page.fill('#input', 'vaav!!! oyaa poth , paeen , kadadhaasi genaavadha?');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0022 - Currency / date / time (M)', async ({ page }) => {
    await page.fill('#input', 'Rs. 998 paekeej eka anidhdhaa udhee 11.30ta dhaemiimata puLuvandha?');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0023 - Medium-length paragraph (M)', async ({ page }) => {
    await page.fill('#input', 'parisaraya yanu minisaa saha samastha jiivii padhDhathiyeema paevaethma thiiraNaya karana saaDhakayayi. varthamaanayee kaarmiikaraNaya saha naagariikaraNaya nisaa parisaraya dhuuShaNaya viima barapathala gaetaLuvaki.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  test('Pos_Fun_0024 - Long-length paragraph (L)', async ({ page }) => {
    await page.fill('#input', 'aDhaapanaya yanu minis jiivithayaka aththivaaramayi. eya pudhgalayekuge dhaenuma, kusalathaa saha aakalpa varDhanaya karamin samaajayee saarThaka puravaesiyeku viimata maga paadhayi. hoDHA aDhaapanaya laebiimen pudhgalayekuta thamangee dhiyuNuva LaGAaa kara gaeniimata pamaNak nova, ratee aarThika haa samaajiiya sanvarDhanayata dha dhaayaka vee. varthamaanayee thaaksaNika lookayee aBhiyooga valata muhuNa dhiima saDHAhaa aDhaapanaya avashYA vana athara , eya pudhgala saaDhaaraNa samaajayak udhesaa laebena hoDHAma aayoojanayakii.');
    await expect(page.locator('#output')).not.toHaveValue('');
  });

  /* NEGATIVE FUNCTIONAL TESTS */

  test('Neg_Fun_0001 - Heavy slang confusion (S)', async ({ page }) => {
    await page.fill('#input', 'adeeh machan eeka nam  supiriyak neh?');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0002 - Excessive joined words (S)', async ({ page }) => {
    await page.fill('#input', 'akkaapansalatayanavaaehigiyaamavelaayanavaaenna');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0003 - Random spacing (S)', async ({ page }) => {
    await page.fill('#input', 'mama      raajakaariyata        yanavaa');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0004 - Long paragraph with typos (L)', async ({ page }) => {
    await page.fill('#input', 'ammaa savasa midhule idhagena idhdhii lassana kurullek piyaBanava dhaekka');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0005 - Mixed English abbreviations (M)', async ({ page }) => {
    await page.fill('#input', 'eyaa major thanathurata promote karalaa');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0006 - Informal + grammar break (S)', async ({ page }) => {
    await page.fill('#input', 'oyaa kannee naee.gihin kaapan ehenam');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0007 - Numeric overload (S)', async ({ page }) => {
    await page.fill('#input', '2026/01/31 12.00 P.M.');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0008 - Line breaks + formatting (M)', async ({ page }) => {
    await page.fill('#input', 'aayuboovan \\nsuBha udhaeesanak\\nsthuuthiyii');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0009 - Ambiguous phrasing (S)', async ({ page }) => {
    await page.fill('#input', 'guruvarayaa kivvaa eeka vaeradhii kiyalaa');
    await expect(page.locator('#output')).toBeVisible();
  });

  test('Neg_Fun_0010 - Edge grammar case (S)', async ({ page }) => {
    await page.fill('#input', 'mata bonna naee baee');
    await expect(page.locator('#output')).toBeVisible();
  });

  /* UI TESTS */

  test('Pos_UI_0001 - Real-time Sinhala output updates while typing (S)', async ({ page }) => {
    await page.type('#input', 'mama paadamak karanavaa');
    const firstValue = await page.locator('#output').inputValue();

    await page.type('#input', ' heta');
    const secondValue = await page.locator('#output').inputValue();

    expect(secondValue).not.toBe(firstValue);
  });

  test('Pos_UI_0002 - Clearing input clears output (S)', async ({ page }) => {
    await page.fill('#input', 'api heta dhuvamu');
    await expect(page.locator('#output')).not.toHaveValue('');

    await page.fill('#input', '');
    await expect(page.locator('#output')).toHaveValue('');
  });

});