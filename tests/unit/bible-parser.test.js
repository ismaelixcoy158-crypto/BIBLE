const test = require('node:test');
const assert = require('node:assert/strict');
const BibleReferenceParser = require('../../src/main/services/bible-reference-parser.js');

test('BibleReferenceParser - Parser Inteligente de Citas Bíblicas', async (t) => {
  const parser = new BibleReferenceParser();

  await t.test('debe reconocer nombres completos con y sin tildes', () => {
    const res1 = parser.parse('Juan 3:16');
    assert.equal(res1.success, true);
    assert.equal(res1.bookId, 43);
    assert.equal(res1.chapter, 3);
    assert.equal(res1.startVerse, 16);

    const res2 = parser.parse('Génesis 1:1');
    assert.equal(res2.success, true);
    assert.equal(res2.bookId, 1);
    assert.equal(res2.chapter, 1);
    assert.equal(res2.startVerse, 1);

    const res3 = parser.parse('Josue 1:9');
    assert.equal(res3.success, true);
    assert.equal(res3.bookId, 6);
    assert.equal(res3.chapter, 1);
    assert.equal(res3.startVerse, 9);
  });

  await t.test('debe reconocer abreviaturas estándar y alternativas', () => {
    const res1 = parser.parse('Jn 3:16');
    assert.equal(res1.success, true);
    assert.equal(res1.bookName, 'Juan');

    const res2 = parser.parse('Sal 100:1');
    assert.equal(res2.success, true);
    assert.equal(res2.bookName, 'Salmos');
    assert.equal(res2.chapter, 100);
    assert.equal(res2.startVerse, 1);

    const res3 = parser.parse('1Co 13:4');
    assert.equal(res3.success, true);
    assert.equal(res3.bookName, '1 Corintios');
    assert.equal(res3.chapter, 13);
    assert.equal(res3.startVerse, 4);
  });

  await t.test('debe reconocer referencias compactas sin espacios y con puntos', () => {
    const res1 = parser.parse('juan3:16');
    assert.equal(res1.success, true);
    assert.equal(res1.bookName, 'Juan');
    assert.equal(res1.chapter, 3);
    assert.equal(res1.startVerse, 16);

    const res2 = parser.parse('jn3.16');
    assert.equal(res2.success, true);
    assert.equal(res2.bookName, 'Juan');
    assert.equal(res2.chapter, 3);
    assert.equal(res2.startVerse, 16);
  });

  await t.test('debe reconocer referencias separadas únicamente por espacios (estilo Holyrics)', () => {
    const res1 = parser.parse('SALMOS 10 12');
    assert.equal(res1.success, true);
    assert.equal(res1.bookName, 'Salmos');
    assert.equal(res1.chapter, 10);
    assert.equal(res1.startVerse, 12);

    const res2 = parser.parse('Juan 3 16');
    assert.equal(res2.success, true);
    assert.equal(res2.bookName, 'Juan');
    assert.equal(res2.chapter, 3);
    assert.equal(res2.startVerse, 16);

    const res3 = parser.parse('1 Juan 3 16');
    assert.equal(res3.success, true);
    assert.equal(res3.bookName, '1 Juan');
    assert.equal(res3.chapter, 3);
    assert.equal(res3.startVerse, 16);
  });

  await t.test('debe reconocer rangos de versículos', () => {
    const res = parser.parse('Juan 3:16-18');
    assert.equal(res.success, true);
    assert.equal(res.chapter, 3);
    assert.equal(res.startVerse, 16);
    assert.equal(res.endVerse, 18);
    assert.equal(res.formattedReference, 'Juan 3:16-18 (RV1909)');
  });

  await t.test('debe reconocer solo libro y capítulo (sin versículo)', () => {
    const res = parser.parse('Salmos 23');
    assert.equal(res.success, true);
    assert.equal(res.bookName, 'Salmos');
    assert.equal(res.chapter, 23);
    assert.equal(res.startVerse, 1);
    assert.equal(res.endVerse, null);
  });

  await t.test('debe tolerar pequeños errores tipográficos', () => {
    const res = parser.parse('genesiss 1:1');
    assert.equal(res.success, true);
    assert.equal(res.bookName, 'Génesis');
  });

  await t.test('debe soportar versiones bíblicas dinámicas (RV1909 por defecto y RVG moderna)', () => {
    const resDefault = parser.parse('Juan 3:16');
    assert.equal(resDefault.success, true);
    assert.equal(resDefault.formattedReference, 'Juan 3:16 (RV1909)');

    const resRvg = parser.parse('Juan 3:16', 'RVG');
    assert.equal(resRvg.success, true);
    assert.equal(resRvg.formattedReference, 'Juan 3:16 (RVG)');

    const resRvgRange = parser.parse('Salmos 23:1-3', 'RVG');
    assert.equal(resRvgRange.success, true);
    assert.equal(resRvgRange.formattedReference, 'Salmos 23:1-3 (RVG)');
  });

  await t.test('debe rechazar entradas totalmente inválidas con mensaje claro', () => {
    const res = parser.parse('texto cualquiera');
    assert.equal(res.success, false);
    assert.ok(res.error);
  });
});

