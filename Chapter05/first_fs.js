import { promises } from 'fs';

(async() => {
    await promises.writeFile('example2.txt', "Here is some text\n");
    const fd = await promises.open('example2.txt', 'a');
    await fd.appendFile("Here is some more text\n");
    await fd.close();
    console.log(await promises.readFile('example2.txt', 'utf8'));
})();