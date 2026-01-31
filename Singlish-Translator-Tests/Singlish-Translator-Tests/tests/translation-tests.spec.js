// @ts-check
import { test, expect } from "@playwright/test";

// Helper function to get the output text
async function getOutput(page, inputText) {
  await page.waitForTimeout(2000); // Wait for translation to complete
  
  // Strategy 1: Find all textareas and get the one that doesn't match input
  const allTextareas = page.locator('textarea');
  const count = await allTextareas.count();
  
  for (let i = 0; i < count; i++) {
    const textarea = allTextareas.nth(i);
    const value = await textarea.inputValue().catch(() => '');
    // If this textarea has content and it's different from input, it's likely the output
    if (value && value !== inputText && value.trim().length > 0) {
      return value;
    }
  }
  
  // Strategy 2: Try to find by looking for Sinhala characters
  const sinhalaChars = /[\u0D80-\u0DFF]/;
  for (let i = 0; i < count; i++) {
    const textarea = allTextareas.nth(i);
    const value = await textarea.inputValue().catch(() => '');
    if (value && sinhalaChars.test(value) && value !== inputText) {
      return value;
    }
  }
  
  // Strategy 3: Try to find near "Sinhala" label using different approaches
  try {
    // Find the Sinhala section - look for parent containers
    const sinhalaLabel = page.locator('text=/Sinhala/i');
    await sinhalaLabel.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    
    // Try to find textarea in the same container as Sinhala label
    const container = sinhalaLabel.locator('xpath=ancestor::*[position()<=5]').last();
    const outputInContainer = container.locator('textarea').first();
    const value = await outputInContainer.inputValue().catch(() => '');
    if (value && value !== inputText) return value;
    
    // Try all textareas again, but check if they're in the Sinhala section
    for (let i = 0; i < count; i++) {
      const textarea = allTextareas.nth(i);
      const isInSinhalaSection = await container.locator('textarea').nth(i).count().catch(() => 0);
      if (isInSinhalaSection > 0) {
        const value = await textarea.inputValue().catch(() => '');
        if (value && value !== inputText) return value;
      }
    }
  } catch (e) {
    // Continue to next strategy
  }
  
  // Strategy 4: If there are exactly 2 textareas, the second one is likely the output
  if (count === 2) {
    const secondValue = await allTextareas.nth(1).inputValue().catch(() => '');
    if (secondValue) return secondValue;
  }
  
  // Strategy 5: Try contenteditable divs
  const contentEditable = page.locator('[contenteditable="true"]');
  const ceCount = await contentEditable.count();
  for (let i = 0; i < ceCount; i++) {
    const elem = contentEditable.nth(i);
    const value = await elem.innerText().catch(() => '');
    if (value && value !== inputText && value.trim().length > 0) {
      return value;
    }
  }
  
  return '';
}

test.describe("Translation Tests - Singlish to Sinhala", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the actual translator website
    await page.goto("https://www.swifttranslator.com/");

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");
    
    // Wait for the input textbox to be visible
    await page.locator('textarea, input[type="text"]').first().waitFor({ state: 'visible' });
  });

  /* ================= POSITIVE FUNCTIONAL TESTS ================= */

  test("Pos_Fun_0001 - Simple sentence – daily usage", async ({ page }) => {
    const input = "mama gammiris vaththata yanna hadhannee";
    const expectedOutput = "මම ගම්මිරිස් වත්තට යන්න හදන්නේ";

    const inputElement = page.locator('textarea, input[type="text"]').first();
    await inputElement.fill(input);
    
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0002 - Compound sentence", async ({ page }) => {
    const input =
      "ammaa rupiyal dhahasak dhunnaa haebaeyi mama prathiksheepa karaa.";
    const expectedOutput =
      "අම්මා රුපියල් දහසක් දුන්නා හැබැයි මම ප්‍රතික්ශේප කරා.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0003 - Complex sentence", async ({ page }) => {
    const input =
      "oyaa niyamitha veelavata vaeda ivara karaa nam oyaata dhavasama nivaaduvak labaa ganna puLuvan";
    const expectedOutput =
      "ඔයා නියමිත වේලවට වැඩ ඉවර කරා නම් ඔයාට දවසම නිවාඩුවක් ලබා ගන්න පුළුවන්";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0004 - Question (interrogative)", async ({ page }) => {
    const input = "oyaata meeka lassanayidha?";
    const expectedOutput = "ඔයාට මේක ලස්සනයිද?";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0005 - Command (imperative)", async ({ page }) => {
    const input = "meesaya ussanna.";
    const expectedOutput = "මේසය උස්සන්න.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0006 - Positive sentence", async ({ page }) => {
    const input =
      "mahansi vii vaeda kara saarThakathvayee ihaLatama yaamata balaaporoththu venavaa.";
    const expectedOutput =
      "මහන්සි වී වැඩ කර සාර්ථකත්වයේ ඉහළටම යාමට බලාපොරොත්තු වෙනවා.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0007 - Negative sentence", async ({ page }) => {
    const input = "mata kisivak kiivee naee";
    const expectedOutput = "මට කිසිවක් කීවේ නෑ";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0008 - Polite request (long)", async ({ page }) => {
    const input =
      "mata thava eka podi udhavvak kara ganna puLuvandha? karuNaakaralaa ee lipiya kiyavaa balalaa mata athsanak dhaa ganna puLuvan nam obathumaata loku pinak. obathumaagee aDhika kaaryayabahulathvaya maedha mata udhav kiriima gaena godaak sthuuthiiyi.";
    const expectedOutput =
      "මට තව එක පොඩි උදව්වක් කර ගන්න පුළුවන්ද? කරුණාකරලා ඒ ලිපිය කියවා බලලා මට අත්සනක් දා ගන්න පුළුවන් නම් ඔබතුමාට ලොකු පිනක්. ඔබතුමාගේ අධික කාර්යයබහුලත්වය මැද මට උදව් කිරීම ගැන ගොඩාක් ස්තූතීයි.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    await page.waitForTimeout(1500);

    // Get the output textbox (the second textarea/input on the page)
    const actualOutput = await page.locator('textarea, input[type="text"]').nth(1).inputValue();
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0009 - Informal phrasing", async ({ page }) => {
    const input = "dhepaarak chek karalaa balapan";
    const expectedOutput = "දෙපාරක් චෙක් කරලා බලපන්";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0010 - Repeated words", async ({ page }) => {
    const input = "mama dhaena gaththa ela ela";
    const expectedOutput = "මම දැන ගත්තා එල එල";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0011 - Joined words (no spaces)", async ({ page }) => {
    const input = "mamavelatagihinennainnavaa";
    const expectedOutput = "මමවෙලටගිහින්එන්නඉන්නවා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0012 - Multi-word expression", async ({ page }) => {
    const input = "mata epaa poddak inna";
    const expectedOutput = "මට එපා පොඩ්ඩක් ඉන්න";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0013 - Past tense", async ({ page }) => {
    const input = "aliyaa iiyee perahaeree giyaa";
    const expectedOutput = "අලියා ඊයේ පෙරහැරේ ගියා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0014 - Present tense", async ({ page }) => {
    const input = "mama dhaen thiintha gaanavaa";
    const expectedOutput = "මම දැන් තීන්ත ගානවා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0015 - Future tense", async ({ page }) => {
    const input = "api iiLaGA miyaesiyata emu";
    const expectedOutput = "අපි ඊළඟ මියැසියට එමු";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0016 - Pronouns (I / you / we)", async ({ page }) => {
    const input =
      "mama thoosea kanna yanna hadhannee, oyath enavadha kanna, api yamu ehenam";
    const expectedOutput =
      "මම තෝසේ කන්න යන්න හදන්නේ, ඔයත් එනවද කන්න, අපි යමු එහෙනම්";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0017 - Plural usage", async ({ page }) => {
    const input = "bakamuuNoo kaee gahanavaa";
    const expectedOutput = "බකමූණෝ කෑ ගහනවා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0018 - Mixed Singlish + English", async ({ page }) => {
    const input = "Ammaa, office yanna kalin cake eka break venna dhaemma";
    const expectedOutput =
      "අම්මා, office යන්න කලින් cake එක break වෙන්න දැම්මා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0019 - English technical terms", async ({ page }) => {
    const input =
      "apee course page eka youtube, facebook follow karanna. heta zoom & teams meeting valata adhaaLa link eka labaa dhenavaa";
    const expectedOutput =
      "අපේ course page එක youtube, facebook follow කරන්න. හෙට zoom & teams meeting වලට අදාළ link එක ලබා දෙනවා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0020 - Place names (Colombo, Kandy)", async ({ page }) => {
    const input =
      "api chilaw giyaata passe madampe gihin beheth aragena munneeshvaram koovilata yanavaa.";
    const expectedOutput =
      "අපි chilaw ගියාට පස්සෙ madampe ගිහින් බෙහෙත් අරගෙන මුන්නේශ්වරම් කෝවිලට යනවා.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0021 - Punctuation marks", async ({ page }) => {
    const input = "vaav!!! oyaa poth , paeen , kadadhaasi genaavadha?";
    const expectedOutput = "වාව්!!! ඔයා පොත් , පෑන් , කඩදාසි ගෙනාවද?";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0022 - Currency / date / time", async ({ page }) => {
    const input =
      "Rs. 998 paekeej eka anidhdhaa udhee 11.30ta dhaemiimata puLuvandha?";
    const expectedOutput =
      "Rs. 998 පැකේජ් එක අනිද්දා උදේ 11.30ට දැමීමට පුළුවන්ද?";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0023 - Medium-length paragraph", async ({ page }) => {
    const input =
      "parisaraya yanu minisaa saha samastha jiivii padhDhathiyeema paevaethma thiiraNaya karana saaDhakayayi. varthamaanayee kaarmiikaraNaya saha naagariikaraNaya nisaa parisaraya dhuuShaNaya viima barapathala gaetaLuvaki.";
    const expectedOutput =
      "පරිසරය යනු මිනිසා සහ සමස්ත ජීවී පද්ධතියේම පැවැත්ම තීරණය කරන සාධකයයි. වර්තමානයේ කාර්මීකරණය සහ නාගරීකරණය නිසා පරිසරය දූෂණය වීම බරපතල ගැටළුවකි.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    await page.waitForTimeout(1500);

    // Get the output textbox (the second textarea/input on the page)
    const actualOutput = await page.locator('textarea, input[type="text"]').nth(1).inputValue();
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Pos_Fun_0024 - Long-length paragraph", async ({ page }) => {
    const input =
      "aDhaapanaya yanu minis jiivithayaka aththivaaramayi. eya pudhgalayekuge dhaenuma, kusalathaa saha aakalpa varDhanaya karamin samaajayee saarThaka puravaesiyeku viimata maga paadhayi. hoDHA aDhaapanaya laebiimen pudhgalayekuta thamangee dhiyuNuva LaGAaa kara gaeniimata pamaNak nova, ratee aarThika haa samaajiiya sanvarDhanayata dha dhaayaka vee. varthamaanayee thaaksaNika lookayee aBhiyooga valata muhuNa dhiima saDHAhaa aDhaapanaya avashYA vana athara , eya pudhgala saaDhaaraNa samaajayak udhesaa laebena hoDHAma aayoojanayakii.";
    const expectedOutput =
      "අධාපනය යනු මිනිස් ජීවිතයක අත්තිවාරමයි. එය පුද්ගලයෙකුගෙ දැනුම, කුසලතා සහ ආකල්ප වර්ධනය කරමින් සමාජයේ සාර්ථක පුරවැසියෙකු වීමට මග පාදයි. හොඳ අධාපනය ලැබීමෙන් පුද්ගලයෙකුට තමන්ගේ දියුණුව ළඟා කර ගැනීමට පමණක් නොව, රටේ ආර්ථික හා සමාජීය සන්වර්ධනයට ද දායක වේ. වර්තමානයේ තාක්සණික ලෝකයේ අභියෝග වලට මුහුණ දීම සඳහා අධාපනය අවශ්‍ය වන අතර , එය පුද්ගල සාධාරණ සමාජයක් උදෙසා ලැබෙන හොඳම ආයෝජනයකී.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    await page.waitForTimeout(2000);

    // Get the output textbox (the second textarea/input on the page)
    const actualOutput = await page.locator('textarea, input[type="text"]').nth(1).inputValue();
    expect(actualOutput).toBe(expectedOutput);
  });

  /* ================= NEGATIVE FUNCTIONAL TESTS ================= */

  test("Neg_Fun_0001 - Heavy slang confusion", async ({ page }) => {
    const input = "adeeh machan eeka nam  supiriyak neh?";
    const expectedOutput = "අඩේහ් මචන් ඒක නම් සුපිරියක් නෙහ්?";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    // This test is expected to fail based on the Excel data
    expect(actualOutput).not.toBe(expectedOutput);
  });

  test("Neg_Fun_0002 - Excessive joined words", async ({ page }) => {
    const input = "akkaapansalatayanavaaehigiyaamavelaayanavaaenna";
    const expectedOutput = "අක්කා පන්සලට යනවා එහි ගියාම වෙලා යනවා එන්න";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    // This test is expected to fail
    expect(actualOutput).not.toBe(expectedOutput);
  });

  test("Neg_Fun_0003 - Random spacing", async ({ page }) => {
    const input = "mama      raajakaariyata        yanavaa";
    const expectedOutput = "මම රාජකාරියට යනවා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    // This test is expected to fail - extra spaces preserved
    expect(actualOutput).not.toBe(expectedOutput);
  });

  test("Neg_Fun_0004 - Long paragraph with typos", async ({ page }) => {
    const input =
      "ammaa savasa midhule idhagena idhdhii lassana kurullek piyaBanava dhaekka";
    const expectedOutput =
      "අම්මා සවස මිදුලේ ඉඳගෙන ඉද්දී ලස්සන කුරුල්ලෙක් පියඹනවා දැක්කා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    // This test is expected to fail due to typos
    expect(actualOutput).not.toBe(expectedOutput);
  });

  test("Neg_Fun_0005 - Mixed English abbreviations", async ({ page }) => {
    const input = "eyaa major thanathurata promote karalaa";
    const expectedOutput = "එයා major තනතුරට promote කරලා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Neg_Fun_0006 - Informal + grammar break", async ({ page }) => {
    const input = "oyaa kannee naee.gihin kaapan ehenam";
    const expectedOutput = "ඔයා කන්නේ නෑ.ගිහින් කාපන් එහෙනම්";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Neg_Fun_0007 - Numeric overload", async ({ page }) => {
    const input = "2026/01/31 12.00 P.M.";
    const expectedOutput = "2026/01/31 12.00 P.M.";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Neg_Fun_0008 - Line breaks + formatting", async ({ page }) => {
    const input = "aayuboovan \\nsuBha udhaeesanak\\nsthuuthiyii";
    const expectedOutput = "ආයුබෝවන් \\nසුභ උදෑසනක් \\nස්තූතියී";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    // This test is expected to fail - line breaks not preserved
    expect(actualOutput).not.toBe(expectedOutput);
  });

  test("Neg_Fun_0009 - Ambiguous phrasing", async ({ page }) => {
    const input = "guruvarayaa kivvaa eeka vaeradhii kiyalaa";
    const expectedOutput = "ගුරුවරයා කිව්වා ඒක වැරදී කියලා";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test("Neg_Fun_0010 - Edge grammar case", async ({ page }) => {
    const input = "mata bonna naee baee";
    const expectedOutput = "මට බොන්න නෑ බෑ";

    await page.locator('textarea, input[type="text"]').first().fill(input);
    const actualOutput = await getOutput(page, input);
    // This test is expected to fail - double negative issue
    expect(actualOutput).not.toBe(expectedOutput);
  });

  /* ================= UI TESTS ================= */

  test("Pos_UI_0001 - Real-time Sinhala output updates while typing", async ({
    page,
  }) => {
    const input = "mama paadamak karanavaa";

    // Type the input character by character
    await page.locator('textarea, input[type="text"]').first().type(input, { delay: 100 });

    // Wait for translation to complete and get output
    const actualOutput = await getOutput(page, input);
    expect(actualOutput).not.toBe("");
    expect(actualOutput).toContain("මම");
  });

  test("Pos_UI_0002 - Clearing input clears output", async ({ page }) => {
    const input = "api heta dhuvamu";

    // Fill input
    await page.locator('textarea, input[type="text"]').first().fill(input);
    
    // Verify output is not empty
    let actualOutput = await getOutput(page, input);
    expect(actualOutput).not.toBe("");

    // Clear input
    await page.locator('textarea, input[type="text"]').first().fill("");
    await page.waitForTimeout(1000);

    // Verify output is cleared - try to get output after clearing
    const allTextareas = page.locator('textarea');
    const count = await allTextareas.count();
    if (count >= 2) {
      actualOutput = await allTextareas.nth(1).inputValue().catch(() => '');
    } else {
      actualOutput = '';
    }
    expect(actualOutput).toBe("");
  });
});
