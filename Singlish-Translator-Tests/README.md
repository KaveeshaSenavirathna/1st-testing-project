# Translator Testing Project - IT3040 Assignment

This project tests a Singlish-to-Sinhala translator using automated browser testing.

## What This Does

I built this test suite to check if the SwiftTranslator website (https://www.swifttranslator.com/) works properly when converting Singlish text into Sinhala script. The tests cover different types of sentences and check both normal usage and problematic inputs.

## My Test Cases

I created 36 different tests that check:

**Normal Translation Tests (24 tests)**
- Basic everyday sentences like "mama gedhara yanavaa"
- Questions and commands
- Different time periods - past, present, future
- Long paragraphs and short phrases
- Mixed Singlish-English like "office eka yanna"
- Numbers, dates, and currency (Rs. 500)
- Place names that shouldn't change (Colombo, Kandy)

**Problem Case Tests (10 tests)**
- Words stuck together without spaces
- Heavy slang that's hard to translate
- Typing mistakes and misspellings
- Weird spacing between words
- Very informal language

**Interface Tests (2 tests)**
- Does output update when typing?
- Does clearing the input box clear output too?

## How I Organized Tests

Each test has an ID that tells you what it does:
- `Pos_Fun_0001` = Positive test, checks normal function
- `Neg_Fun_0001` = Negative test, checks error handling
- `Pos_UI_0001` = User interface behavior test

Length markers show input size:
- (S) means short input, under 30 characters
- (M) means medium, between 31-299 characters  
- (L) means long, 300+ characters

## Setting Up The Tests

You need Node.js on your computer first. Then:

```bash
npm install
npx playwright install
```

This downloads everything needed to run browser tests.

## Running My Tests

Basic command:
```bash
npx playwright test
```

See the browser while testing:
```bash
npx playwright test --headed
```

Only run specific tests:
```bash
npx playwright test -g "Pos_Fun"
```

View results after:
```bash
npx playwright show-report
```

## Files in This Project

- `tests/translator.spec.js` - Where all my test code lives
- `package.json` - Lists what software this needs
- `README.md` - This file you're reading now

## Test Writing Approach

I wrote tests by thinking about real usage. For example, someone might type "mama office eka yanava car eken" mixing English words naturally. Or they might make typos like "idhagena" instead of "indagena". Each test checks one specific thing.

Here's what a simple test looks like:

```javascript
test('Check basic sentence works', async ({ page }) => {
  await page.fill('#input', 'mama gedhara yanavaa');
  await expect(page.locator('#output')).not.toHaveValue('');
});
```

## Why These Specific Tests?

I picked test cases based on how Sri Lankans actually type Singlish:
- We mix English technical words (Zoom, email, WiFi)
- We use informal slang (machan, ela)
- Sometimes we join words (mamayanavaa)
- We need punctuation to stay correct
- Currency and time formats matter (Rs.500, 10.30AM)

## Test Results Meaning

When tests run, you see:
- Green checkmark = Translation worked correctly
- Red X = Something failed, needs checking
- Report shows exactly which part broke

## Changing For Your Translator

Want to test a different translator? Just modify this part:

```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('your-website-here.com');
});
```

Also change the field selectors (`#input`, `#output`) to match your website's HTML.

## Project Background

**Student:** M.M.P.K. Senavirathna  
**Reg Number:** IT23665552  
**Course:** IT3040 IT Project Management  
**University:** SLIIT  
**Semester:** Year 3, Semester 1  
**Assignment:** Testing translator functionality

## What I Learned

Building this taught me:
- How to write automated tests properly
- Thinking about edge cases users might encounter  
- Organizing tests in a maintainable way
- Using Playwright framework effectively

## If You Want To Add Tests

Feel free to add more test cases if you think of scenarios I missed. Just:
1. Follow the naming pattern I used
2. Put tests in the right category (Pos_Fun, Neg_Fun, etc)
3. Add a clear description
4. Mark the input length (S/M/L)

## Common Issues

**"npm command not found"**  
Install Node.js from nodejs.org first.

**"playwright not installed"**  
Run `npx playwright install` to get browsers.

**Tests fail immediately**  
Check if the translator website is actually running and accessible.

## Notes

The test file uses a mock translator for demonstration. When connecting to the real website, update the URL in `beforeEach()` and adjust selectors to match actual HTML elements.

Some test cases intentionally check failure scenarios - that's normal for negative testing. The goal is seeing how the system handles bad input, not just good input.

## Contact

Questions about these tests? Check the code comments or review the test case descriptions. Each test explains what it's checking for.

---

Built as coursework for learning software testing practices.

