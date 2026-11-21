-- BIBLE: 010_pentecostal_choruses_seed.sql
-- Semilla de más de 300 coritos pentecostales clásicos pre-cargados
-- Categoría 1: 'Coritos Pentecostales'

-- Asegurar índice único en título para evitar duplicados en inserciones
CREATE UNIQUE INDEX IF NOT EXISTS idx_choruses_title_unique ON choruses(title COLLATE NOCASE);

INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabaré a mi Señor', 'Alabaré, alabaré, alabaré, alabaré
Alabaré a mi Señor.

Juan vio el número de los redimidos
Y todos alababan al Señor:
Unos oraban, otros cantaban,
Y todos alababan al Señor.

Alabaré, alabaré, alabaré, alabaré
Alabaré a mi Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En el principio el Espíritu de Dios', 'En el principio el Espíritu de Dios
Se movía sobre las aguas.

Y hoy se mueve dentro de mi corazón,
Y hoy se mueve dentro de mi corazón.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Va a haber un avivamiento', 'Va a haber un avivamiento en mi iglesia,
Va a haber un avivamiento en mi iglesia,
Va a haber un avivamiento.

Desde el norte hasta el sur,
Desde el este hasta el oeste,
Va a haber un avivamiento en mi iglesia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fuego, fuego, fuego pentecostal', 'Fuego, fuego, fuego, fuego pentecostal,
Fuego que sana, fuego que salva,
Fuego que limpia todo mal.

Fuego que llena los corazones,
Fuego que rompe las prisiones,
Fuego de Dios, fuego pentecostal.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El fuego cae, cae', 'El fuego cae, cae,
Los males salen, salen,
Y el creyente alaba al Señor.

El fuego cae, cae,
Los males salen, salen,
Y el creyente alaba al Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Manda fuego, Señor', 'Manda fuego, Señor, manda fuego,
Manda fuego de tu poder.

Que descienda del cielo la llama,
Que me llene de gracia y poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En el altar de Dios el fuego está encendido', 'En el altar de Dios, en el altar de Dios,
El fuego está encendido.

Nadie lo puede apagar, nadie lo puede apagar,
Porque el fuego del Señor en mi corazón está.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ya llegó, ya llegó, el Espíritu Santo ya llegó', 'Ya llegó, ya llegó, el Espíritu Santo ya llegó.
Ya llegó, ya llegó, el Espíritu Santo ya llegó.

Lo siento en las manos, lo siento en los pies,
Lo siento en el alma y en todo mi ser.
Aquel que caminó sobre las aguas,
Está aquí, está a mi lado.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Satúrame, Señor, con tu Espíritu', 'Satúrame, Señor, con tu Espíritu,
Satúrame, Señor, con tu Espíritu.

Y déjame sentir el fuego de tu amor
Aquí en mi corazón, oh Dios.
Y déjame sentir el fuego de tu amor
Aquí en mi corazón, oh Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bautízame, Señor, con tu Espíritu', 'Bautízame, Señor, con tu Espíritu,
Bautízame, Señor, con tu Espíritu,
Bautízame, Señor, con tu Espíritu,
Y déjame sentir tu poder.

Y déjame sentir el fuego en mi alma,
Y déjame sentir tu presencia, Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pentecostés día de gozo', 'Pentecostés, día de gozo,
Pentecostés, día de fiesta.

Cuando el Espíritu Santo descendió
Con lenguas de fuego en el aposento alto.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Espíritu Santo se siente aquí', 'El Espíritu Santo se siente aquí,
El Espíritu Santo se siente aquí.

Si los hombres le alaban, se siente la gloria,
Si los hombres le alaban, se siente el poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aquel que la buena obra empezó', 'Aquel que la buena obra empezó,
Aquel que la buena obra empezó,
Será fiel en completarla,
Él es fiel en completarla.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Algo está cayendo aquí', 'Algo está cayendo aquí,
Es tan fuerte sobre mí,
Mis manos levantaré
Y su gloria tocaré.

Está cayendo su gloria sobre mí,
Sanando heridas, levantando al caído,
Su gloria está aquí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Se mueve la mano de Dios', 'Se mueve la mano de Dios
En su palabra viva.
Se mueve la mano de Dios
En su palabra viva.

Se mueve, se mueve, se mueve con poder,
Se mueve, se mueve, se mueve con poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Allá en el monte Horeb la zarza ardía', 'Allá en el monte Horeb la zarza ardía,
Allá en el monte Horeb la zarza ardía.
Moisés oyó una voz que le decía:
Moisés oyó una voz que le decía:

Quita, quita, quita las sandalias de tus pies,
Porque el lugar que pisas santo es.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Como la zarza que ardía', 'Como la zarza que ardía y no se consumía,
Quiero que arda mi alma con tu poder.

Fuego, fuego que no se apaga,
Fuego que purifica, ven y lléname hoy.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fuego ha bajado del cielo', 'Fuego ha bajado del cielo,
¿Qué quieres que haga si está encendido?

Si está encendido, si está encendido,
¿Quién lo apagará?
El fuego de Dios en mi alma está.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay poder, poder, sin igual poder', 'Hay poder, poder, sin igual poder
En Jesús, que murió.

Hay poder, poder, sin igual poder
En la sangre que él vertió.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si no hubiera sido por el Señor', 'Si no hubiera sido por el Señor,
Si no hubiera sido por el Señor,
Mi alma se hubiera perdido,
Si no hubiera sido por el Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El culto de hoy va a ser maravilloso', 'El culto de hoy va a ser maravilloso,
Porque Jesús va a derramar de su poder.

Derrama, Señor, derrama, Señor,
Derrama sobre nosotros tu poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Viva la fe, viva la esperanza, viva el amor', 'Viva la fe, viva la esperanza, viva el amor,
Viva la fe, viva la esperanza, viva el amor,
Viva la fe, viva la esperanza, viva el amor.

Que viva Cristo, que viva Cristo, que viva el Rey.
Que viva Cristo, que viva, que viva Cristo,
Que viva, que viva Cristo, que viva el Rey.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jacob luchó con el ángel', 'Jacob luchó con el ángel
Por una bendición.
Jacob luchó con el ángel
Por una bendición.

Dámela, Señor, con tu poder,
Dámela, Señor, con tu poder.
Yo no te dejaré si no me bendices,
Yo no te dejaré si no me bendices.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová está en su templo', 'Jehová está en su templo,
Alábale que él vive.
Jehová está en su templo,
Alábale que él vive.

Alábale, alábale, alábale que él vive,
Alábale, alábale, alábale que él vive.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No sabéis que sois templo', '¿No sabéis, no sabéis que sois templo?
¿No sabéis, no sabéis que sois templo?
¿No sabéis, no sabéis que sois templo?
Sois el templo del Espíritu de Dios.

Lleno de poder, lleno de gloria y alabanza,
Sois el templo del Espíritu de Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios está aquí, qué precioso es', 'Dios está aquí, qué precioso es,
Él lo prometió donde están dos o tres.

Quédate, Señor, quédate, Señor,
Quédate, Señor, en cada corazón.
Quédate, Señor, quédate, Señor,
Quédate, Señor, aquí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si el Espíritu de Dios se mueve en mí', 'Si el Espíritu de Dios se mueve en mí,
Yo canto como David.
Si el Espíritu de Dios se mueve en mí,
Yo canto como David.

Yo canto, yo canto, yo canto como David.
Yo canto, yo canto, yo canto como David.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pon aceite en mi lámpara, Señor', 'Pon aceite en mi lámpara, Señor,
Pon aceite en mi lámpara, Señor,
Que yo quiero servirte con amor,
Pon aceite en mi lámpara, Señor.

Señor Jesús, tú eres mi vida,
Señor Jesús, tú eres mi amor.
Salvaste mi alma perdida,
Por eso te alabo con el corazón.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('David danzaba en la presencia del Señor', 'David, David, David, David danzaba,
Y su esposa Saúl se avergonzaba.

Porque David danzaba para Jehová,
Con regocijo y con libertad.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuando el pueblo del Señor alaba a Dios', 'Cuando el pueblo del Señor alaba a Dios,
Suceden cosas, suceden cosas maravillosas.

Hay sanidad, liberación,
Se siente la bendición.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con mis labios y mi vida te alabo, Señor', 'Con mis labios y mi vida
Te alabo, Señor, te alabo, Señor.
Con mis labios y mi vida
Te alabo, bendito Jesús.

Porque tú has sido grande para mí,
Grande para mí, grande para mí.
Porque tú has sido grande para mí,
Te alabo, bendito Jesús.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pasa por aquí, Señor', 'Pasa por aquí, Señor, pasa por aquí.
Pasa por aquí, Señor, pasa por aquí.

Oh, Señor, pasa por aquí.
Oh, Señor, pasa por aquí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo tengo un abogado que me defiende', 'Yo tengo un abogado que me defiende,
Él nunca está ocupado, siempre me atiende.

Él nunca pierde un caso, todos los gana,
Su nombre es Jesucristo de Nazaret.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es la peña de Horeb', 'Cristo es la peña de Horeb que está brotando
Agua de vida saludable para ti.

Ven a beberla que es más dulce que la miel,
Refresca el alma, satisface todo tu ser.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jonás no le hizo caso a la palabra de Dios', 'Jonás no le hizo caso a la palabra de Dios,
Por eso al mar profundo la gente lo tiró.

Y vino un pez muy grande y ¡glup! se lo tragó.
Porque no le hizo caso a la palabra de Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay victoria en la sangre de Jesús', 'Hay victoria, hay victoria,
Hay victoria en la sangre de Jesús.

No podrá el enemigo vencer a los redimidos,
Porque hay victoria en la sangre de Jesús.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No con ejército, ni con espada', 'No con ejército, ni con espada,
Sino con su Santo Espíritu.
No con ejército, ni con espada,
Sino con su Santo Espíritu.

Y esos montes se moverán,
Y esos montes se moverán,
Y esos montes se moverán
Con su Santo Espíritu.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Los muros caen', 'Los muros caen, los muros caen,
Y con ellos las cadenas.

Los muros caen, los muros caen,
Se derrumban por el poder de Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Satán no podrá vencer', 'Satán no podrá vencer al pueblo del Señor,
Satán no podrá vencer al pueblo del Señor.

Porque Cristo va adelante como poderoso gigante,
Satán no podrá vencer al pueblo del Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aunque un ejército acampe contra mí', 'Aunque un ejército acampe contra mí,
No temerá mi corazón.
Aunque contra mí se levante guerra,
Yo estaré confiado.

Jehová es mi luz y mi salvación,
¿De quién temeré?
Jehová es la fortaleza de mi vida.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con mi Dios yo saltaré los muros', 'Con mi Dios yo saltaré los muros,
Con mi Dios ejércitos derribaré.

Él adiestra mis manos para la batalla,
Puedo tomar con mis manos el arco de bronce.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo rompe las cadenas', 'Cristo rompe las cadenas,
Cristo rompe las cadenas,
Cristo rompe las cadenas
Y me da seguridad.

¿Cómo es posible yo vivir sin ti, Jesús,
Si el fundamento de mi vida eres tú?', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El diablo está enojado, hay una razón', 'El diablo está enojado, hay una razón,
El diablo está enojado, hay una razón:
Cristo vive en mi corazón
Y mis pecados son perdonados.

Yo amo a mi hermano, hay una razón,
Cristo vive en mi corazón.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es varón de guerra', 'Jehová es varón de guerra,
Jehová es su nombre.
Cantad a Jehová porque se ha magnificado,
Echó en el mar al caballo y al jinete.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mayor es el que está en nosotros', 'Mayor es el que está en nosotros,
Mayor es el que está en nosotros,
Que el que está en el mundo.

No temeré lo que me pueda hacer el hombre,
Mayor es el que está en nosotros.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Caerán a tu lado mil', 'Caerán a tu lado mil,
Y diez mil a tu diestra,
Mas a ti no llegará,
Con tus ojos mirarás.

Porque has puesto a Jehová, que es mi esperanza,
Al Altísimo por tu habitación.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No hay arma forjada contra ti', 'No hay arma forjada que pueda prosperar,
Toda lengua que se levante contra ti condenarás.

Esta es la herencia de los siervos de Jehová,
Su salvación de mí vendrá.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Santo de Israel es poderoso', 'El Santo de Israel es poderoso,
El Santo de Israel es vencedor.

Levántate, resplandece, porque ha venido tu luz,
Y la gloria de Jehová ha nacido sobre ti.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Poderoso es nuestro Dios', 'Poderoso es nuestro Dios,
Poderoso es nuestro Dios.

Él salva, él sana, bautiza con poder,
Poderoso es nuestro Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Suena la trompeta en Sión', 'Suena la trompeta en Sión,
Proclama en el santo monte.

Porque el día de Jehová viene,
Porque cercano está.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La sangre de Cristo tiene poder', 'La sangre de Cristo tiene poder,
Para deshacer las obras de Satanás.

Tiene poder, tiene poder,
La sangre de Cristo tiene poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con voz de mando', 'Con voz de mando, con voz de arcángel,
Y con trompeta de Dios descenderá.

Y los muertos en Cristo resucitarán primero,
Luego nosotros seremos arrebatados.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Más que vencedor en Cristo', 'Vencedor, vencedor, en Cristo soy más que vencedor.
Ni la muerte, ni la vida, ni ángeles, ni principados,
Podrán separarme del amor de Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Derriba los muros de Jericó', 'Siete vueltas a la ciudad le dieron,
Tocaron las trompetas y los muros cayeron.

Grita, pueblo de Dios, con voz de júbilo,
Que los muros de Jericó ya cayeron.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuando el pueblo de Dios ora', 'Cuando el pueblo de Dios ora, suceden cosas grandes,
Cadenas se rompen, enfermos son sanos.

Ora con fe, clama al Señor,
Que el Dios de los cielos te responderá.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Este gozo no va a pasar', 'Este gozo no va a pasar, no va a pasar,
Este gozo no va a pasar, no va a pasar,
Este gozo no va a pasar,
Porque está dentro de mi corazón.

El fuego cae, cae,
Los males salen, salen,
Y el creyente alaba al Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo me alegré con los que me decían', 'Yo me alegré con los que me decían:
A la casa de Jehová iremos.
Yo me alegré con los que me decían:
A la casa de Jehová iremos.

Allí estaré, allí estaré,
A la casa de Jehová iremos.
Allí estaré, allí estaré,
A la casa de Jehová iremos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué bueno es alabarte, oh Jehová', 'Qué bueno es alabarte, oh Jehová,
Y cantar salmos a tu nombre.
Qué bueno es alabarte, oh Jehová,
Y cantar salmos a tu nombre.

Anunciar por la mañana tu misericordia,
Y tu fidelidad de noche.
Anunciar por la mañana tu misericordia,
Y tu fidelidad de noche.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantaré al Señor por siempre', 'Cantaré al Señor por siempre,
Su diestra es todo poder.
Cantaré al Señor por siempre,
Su diestra es todo poder.

Echó a la mar quien los perseguía,
Jinete y caballo echó a la mar.
Echó a la mar los carros del faraón,
Lara lara lara la.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me gozaré, me alegraré', 'Me gozaré, me alegraré,
Y cantaré al Señor.
Porque han llegado las bodas
Del Cordero de Dios.

Y a su esposa se le ha concedido
Que se vista de lino fino,
Limpio y resplandeciente,
Para recibir al Rey.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alzaré mis ojos a los montes', 'Alzaré mis ojos a los montes,
¿De dónde vendrá mi socorro?
Mi socorro viene de Jehová,
Que hizo los cielos y la tierra.

No dará tu pie al resbaladero,
Ni se dormirá el que te guarda.
Jehová es tu guardador,
Jehová es tu sombra a tu mano derecha.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grandes y maravillosas son tus obras', 'Grandes y maravillosas son tus obras,
Señor Dios Todopoderoso.
Justos y verdaderos son tus caminos,
Rey de los santos.

¿Quién no te temerá, oh Señor,
Y glorificará tu nombre?
Pues solo tú eres santo,
Por lo cual todas las naciones vendrán y te adorarán.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantad a Jehová cántico nuevo', 'Cantad a Jehová cántico nuevo,
Porque ha hecho grandes maravillas.
Cantad a Jehová cántico nuevo,
Porque ha hecho grandes maravillas.

Alabanza y magnificencia delante de él,
Poder y alegría en su morada.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabad a Jehová porque él es bueno', 'Alabad a Jehová porque él es bueno,
Porque para siempre es su misericordia.
Alabad al Dios de los dioses,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bueno es alabarte, Señor', 'Bueno es alabarte, Señor,
Y cantar salmos a tu nombre, oh Altísimo.
De mañana anunciar tu misericordia,
Y tu verdad cada noche.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mirad cuán bueno y cuán delicioso es', 'Mirad cuán bueno y cuán delicioso es
Habitar los hermanos juntos en armonía.
Mirad cuán bueno y cuán delicioso es
Habitar los hermanos juntos en armonía.

Porque allí envía Jehová bendición,
Y vida eterna.
Porque allí envía Jehová bendición,
Y vida eterna.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Celebrad a Cristo, celebrad', 'Celebrad a Cristo, celebrad,
Celebrad a Cristo, celebrad.

Él resucitó, él resucitó,
Y por siempre vivirá.
Él resucitó, él resucitó,
Vamos a celebrar que el Señor resucitó.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Remolineando, remolineando', 'Hay muchas formas de alabar su nombre
Y de exaltarle, oh Jehová.
Hay muchas formas de glorificarle,
Pero ahora yo remolinearé.

Remolineando, remolineando,
Celebraré a Jehová.
Remolineando, remolineando,
Me haré más vil por causa de Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo celebraré, cantaré a él', 'Yo celebraré, cantaré a él,
Cantaré un nuevo cántico.
Yo celebraré, cantaré a él,
Cantaré un nuevo cántico.

Alabaré a Jehová,
Porque él ha triunfado con gloria.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Has cambiado mi lamento en baile', 'Has cambiado mi lamento en baile,
Me ceñiste de alegría.
Por tanto, a ti cantaré,
Gloria mía, y no estaré callado.

Jehová Dios mío, te alabaré,
Te alabaré para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Danzaré, cantaré', 'Danzaré, cantaré,
En tu presencia me gozaré.
Tú eres mi Dios, tú eres mi Rey,
Con alegría te exaltaré.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En la presencia de Jehová hay plenitud de gozo', 'En la presencia de Jehová
Hay plenitud de gozo.
A su diestra delicias
Para siempre jamás.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi copa está rebosando', 'Mi copa está rebosando,
Rebosando de su amor.
Desde que Cristo me salvó,
Mi copa rebosando está.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No hay Dios tan grande como tú', 'No hay Dios tan grande como tú,
No lo hay, no lo hay.
No hay Dios tan grande como tú,
No lo hay, no lo hay.

No hay Dios que pueda hacer las obras
Como las que haces tú.
No hay Dios que pueda hacer las obras
Como las que haces tú.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Como relámpago que sale del oriente', 'Como relámpago que sale del oriente
Y se muestra en el occidente,
Así será la venida del Hijo del Hombre.

Velad y orad, porque no sabéis
El día ni la hora en que el Hijo vendrá.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ya ha llegado el momento', 'Ya ha llegado el momento de alabar a Dios,
Levantando las manos al cielo.
Ya ha llegado el momento de alabar a Dios,
Con pandero, trompeta y con júbilo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te alabaré, oh Señor', 'Te alabaré, oh Señor, con todo mi corazón,
Delante de los dioses te cantaré salmos.
Me postraré hacia tu santo templo,
Y alabaré tu nombre por tu misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús, yo te amo', 'Jesús, yo te amo,
Jesús, yo te amo,
Jesús, yo te amo a ti.

Porque tú me has salvado,
Porque tú me has amado,
Jesús, yo te amo a ti.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En mi corazón hay una canción', 'En mi corazón hay una canción,
Es de alabanza para mi Señor.
En mi corazón hay una canción,
Que brota de su inmenso amor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay momentos tan especiales', 'Hay momentos que las palabras no alcanzan
Para decirte lo que siento, bendito Salvador.

Te agradezco por todo lo que has hecho,
Por todo lo que haces y todo lo que harás.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Maravilloso Dios tú eres para mí', 'Maravilloso Dios tú eres para mí,
Primero en mi vida, principio y fin.

Tu gracia me sostiene, tu amor me llena,
Maravilloso Dios, te alabo a ti.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuán grande es Dios', 'Cuán grande es Dios, cántale:
Cuán grande es Dios, y todos lo verán,
Cuán grande es Dios.

Su nombre sobre todo es,
Digno de alabar,
Y mi ser dirá: cuán grande es Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Renuévame, Señor Jesús', 'Renuévame, Señor Jesús,
Ya no quiero ser igual.
Renuévame, Señor Jesús,
Pon en mí tu corazón.

Porque todo lo que hay dentro de mí
Necesita ser cambiado, Señor.
Porque todo lo que hay dentro de mi corazón
Necesita más de ti.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te exaltaré, mi Dios, mi Rey', 'Te exaltaré, mi Dios, mi Rey,
Y bendeciré tu nombre
Eternamente y para siempre.

Cada día te bendeciré,
Y alabaré tu nombre
Eternamente y para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una mirada de fe', 'Una mirada de fe, una mirada de fe,
Es la que puede salvar al pecador.
Una mirada de fe, una mirada de fe,
Es la que puede salvar al pecador.

Y si tú vienes a Cristo Jesús,
Él te perdonará,
Porque una mirada de fe
Es la que te puede salvar.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Libre, tú me hiciste libre', 'Libre, tú me hiciste libre,
Tú me hiciste libre, libre, Señor.
Libre, tú me hiciste libre,
Tú me hiciste libre, libre, Señor.

Rotas fueron las cadenas
Que ataban mi corazón.
Libre, tú me hiciste libre,
Libre, Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El hombre de Galilea va pasando ya', 'El hombre de Galilea va pasando ya,
El hombre de Galilea va pasando ya.

Déjalo que te toque, déjalo que te toque,
Déjalo que te toque y recibe la bendición.
Déjalo que te toque, déjalo que te toque,
Déjalo que te toque y recibe la bendición.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si crees en el Señor verás la gloria de Dios', '¿No te he dicho que si crees
Verás la gloria de Dios?
¿No te he dicho que si crees
Verás la gloria de Dios?

Verás la gloria de Dios,
Verás la gloria de Dios,
¿No te he dicho que si crees
Verás la gloria de Dios?', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús está pasando por aquí', 'Jesús está pasando por aquí,
Jesús está pasando por aquí.

Y cuando pasa todo se transforma,
Se va la tristeza, llega la alegría.
Y cuando pasa todo se transforma,
Llega la alegría para ti y para mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tócame, Señor, con tu poder', 'Tócame, Señor, con tu poder,
Tócame, Señor, con tu poder.
Que mi alma sienta la gloria de Dios,
Tócame, Señor, con tu poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Por la llaga de Jesús fui sanado', 'Por la llaga de Jesús fui sanado,
Por la llaga de Jesús tengo paz.
Él llevó mis dolores y mis enfermedades,
Por la llaga de Jesús tengo paz.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Solo Dios hace al hombre feliz', 'Solo Dios hace al hombre feliz,
Solo Dios hace al hombre feliz.
La vida es nada, todo se acaba,
Solo Dios hace al hombre feliz.

Cristo te ama, él te llama,
Ven a él y serás feliz.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo sé que Cristo vendrá', 'Yo sé que Cristo vendrá,
Yo sé que Cristo vendrá.
Si tú estás preparado
Con él te irás.

Arriba, arriba, arriba iremos,
Abajo, abajo el diablo quedará.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pronto vendrá el Señor a su iglesia a levantar', 'Pronto vendrá el Señor a su iglesia a levantar,
En una nube blanca nos llevará a morar.

No habrá más llanto, no habrá más dolor,
Estaremos para siempre en la presencia del Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Estamos esperando que Cristo venga', 'Estamos esperando que Cristo venga,
Estamos esperando la redención.
El cielo se abrirá y en las nubes aparecerá
El Salvador del mundo, el Rey de gloria.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No te desanimes, sigue adelante', 'No te desanimes, sigue adelante,
Que la victoria es del creyente.
Cristo va contigo, él es tu escudo,
No temas el camino, Dios es tu abrigo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aunque la higuera no florezca', 'Aunque la higuera no florezca,
Ni en las vides haya frutos,
Aunque falte el producto del olivo,
Y los labrados no den mantenimiento.

Con todo yo me alegraré en Jehová,
Y me gozaré en el Dios de mi salvación.
Jehová el Señor es mi fortaleza,
El cual hace mis pies como de ciervas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Todo lo puedo en Cristo', 'Todo lo puedo en Cristo que me fortalece,
Todo lo puedo en Cristo que me fortalece.

No temeré mal alguno,
Porque tú estás conmigo,
Tu vara y tu cayado me infundirán aliento.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El que habita al abrigo del Altísimo', 'El que habita al abrigo del Altísimo
Morará bajo la sombra del Omnipotente.
Diré yo a Jehová: Esperanza mía, y castillo mío;
Mi Dios, en quien confiaré.

Él te librará del lazo del cazador,
De la peste destructora.
Con sus plumas te cubrirá,
Y debajo de sus alas estarás seguro.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es mi pastor, nada me faltará', 'Jehová es mi pastor, nada me faltará,
En lugares de delicados pastos me hará descansar.
Junto a aguas de reposo me pastoreará,
Confortará mi alma.

Ciertamente el bien y la misericordia
Me seguirán todos los días de mi vida,
Y en la casa de Jehová moraré por largos días.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios no nos trajo hasta aquí para volver atrás', 'Dios no nos trajo hasta aquí para volver atrás,
Nos trajo aquí a poseer la tierra que nos dio.

Aunque el gigante se levante contra ti,
No temas que contigo va el Gran Yo Soy.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ebenezer, hasta aquí nos ayudó Jehová', 'Ebenezer, hasta aquí nos ayudó Jehová,
Ebenezer, hasta aquí nos ayudó Jehová.

Con su poder y su gran misericordia,
Hasta aquí nos ayudó Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová Jireh, mi proveedor', 'Jehová Jireh, mi proveedor,
Su gracia es suficiente para mí.

Él suplirá todas mis necesidades,
Conforme a sus riquezas en gloria.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová Rafa, el Señor que sana', 'Jehová Rafa, el Señor que sana,
Él envió su palabra y los sanó.
De sus ruinas los libró,
Alabemos su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová Shalom, el Dios de paz', 'Jehová Shalom, el Dios de paz,
Reina en mi corazón hoy y siempre.
La paz que sobrepasa todo entendimiento
Guardará vuestros corazones en Cristo Jesús.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová Nissi, mi bandera', 'Jehová Nissi, mi bandera de victoria,
En su nombre levantaremos banderas.
Con él somos más que vencedores,
En el nombre de Jesús.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor es mi luz y mi salvación', 'El Señor es mi luz y mi salvación,
¿De quién temeré?
El Señor es la defensa de mi vida,
¿De quién he de atemorizarme?', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabemos al Cordero de Dios', 'Alabemos al Cordero de Dios,
Que quita el pecado del mundo.
Digno es el Cordero que fue inmolado
De recibir el poder y la gloria.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Santo, Santo, Santo, dicen los serafines', 'Santo, Santo, Santo, dicen los serafines,
Santo, Santo, Santo, al Señor Jehová.

Los cielos y la tierra están llenos de su gloria,
Santo es el Señor, Dios del universo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay una fuente en mí que está brotando', 'Hay una fuente en mí que está brotando,
Hay una fuente en mí que está fluyendo.
Es el Espíritu de Dios que me inunda,
Fuente de agua viva para salvación.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Lávame en tu sangre, Cordero de Dios', 'Lávame en tu sangre, Cordero de Dios,
Quita toda mancha de mi corazón.
Hazme más blanco que la nieve, Señor,
Límpiame por dentro con tu grande amor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo quiero más y más de Cristo', 'Yo quiero más y más de Cristo,
Yo quiero más de su poder.
Yo quiero más de su presencia,
Yo quiero más y más de él.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dame más de ti, Señor', 'Dame más de ti y menos de mí,
Dame más de ti y menos de mí.

Que mengüe yo para que crezcas tú,
Que mengüe yo para que crezcas tú,
Dame más de ti, Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Heme aquí, Señor, envíame a mí', 'Heme aquí, Señor, envíame a mí,
Heme aquí, Señor, envíame a mí.
A las naciones llevaré tu verdad,
Heme aquí, Señor, envíame a mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Id por todo el mundo', 'Id por todo el mundo y predicad el evangelio
A toda criatura en el nombre del Señor.
El que creyere y fuere bautizado será salvo,
Mas el que no creyere será condenado.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo sembré, Apolos regó', 'Yo sembré, Apolos regó,
Pero el crecimiento lo da Dios.
No es del que corre ni del que quiere,
Sino de Dios que tiene misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Trabajad, trabajad, la noche viene', 'Trabajad, trabajad mientras dura el día,
La noche viene cuando nadie puede obrar.
Llevad las gavillas con cantos de alegría,
Al granero del Señor a descansar.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sembraré la simiente preciosa', 'Sembraré la simiente preciosa
Del glorioso evangelio de amor.
Segaré, al venir el Maestro,
Con regocijo y con santo fervor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mirad los campos están blancos', 'Mirad los campos blancos para la siega,
La mies es mucha y los obreros pocos son.
Rogad al Padre que envíe obreros
A su mies con santo celo y devoción.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo quiero andar las calles de oro', 'Yo quiero andar las calles de oro con Jesús,
Yo quiero ver el mar de cristal.
Quiero cantar con los ángeles arriba,
Y darle gloria al Santo de Israel.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Más allá del sol', 'Aunque en esta vida no tenga riquezas,
Sé que allá en la gloria tengo una mansión.
Cual alma perdida entre las pobrezas,
De mí Jesucristo tuvo compasión.

Más allá del sol, más allá del sol,
Yo tengo un hogar, hogar, bello hogar
Más allá del sol.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jerusalén, qué bonita eres', 'Jerusalén, qué bonita eres,
Calles de oro, mar de cristal.
Por esas calles yo voy a caminar,
Calles de oro, mar de cristal.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuando allá se pase lista', 'Cuando la trompeta suene en aquel día final,
Y el alba eterna rompa en claridad;
Cuando las naciones salvas a su patria lleguen ya,
Y que sea pasada lista, allí he de estar.

Cuando allá se pase lista,
Cuando allá se pase lista,
Cuando allá se pase lista,
A mi nombre yo feliz responderé.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Volando en las nubes con Cristo', 'Volando en las nubes con Cristo me iré,
A la patria celestial donde no hay dolor.
La trompeta sonará y el pueblo de Dios subirá,
Aleluya al Cordero, aleluya al Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La mañana gloriosa', 'Cuán gloriosa será la mañana
Cuando venga Jesús el Salvador.
Las naciones unidas como hermanas,
Bienvenida daremos al Señor.

No habrá necesidad de la luz ni el resplandor,
Ni el sol dará su luz, ni tampoco su calor.
Allí no habrá dolor, ni llanto para el fiel,
Porque el Rey de reyes es el Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una voz me dice desde el cielo', 'Una voz me dice desde el cielo:
Sigue fiel, sigue fiel hasta el fin.
Que la corona de la vida eterna
Reservada está para ti.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo me voy con él', 'Yo me voy con él, yo me voy con él,
Yo me voy con él a gozar en la gloria.
Si tú quieres ir, entrégale tu ser,
Y con Cristo en el cielo vas a vencer.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Demos gracias al Señor, demos gracias', 'Demos gracias al Señor, demos gracias,
Demos gracias por su amor.
Demos gracias al Señor, demos gracias,
Demos gracias por su amor.

Por las mañanas las aves cantan
Las alabanzas a Cristo el Salvador.
Y tú, hermano, ¿por qué no cantas
Las alabanzas a Cristo el Salvador?', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A Dios sea la gloria', 'A Dios sea la gloria, a Dios sea la gloria,
A Dios sea la gloria por lo que él ha hecho.
Con su sangre me ha limpiado,
Su poder me ha levantado,
A Dios sea la gloria por lo que él ha hecho.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alaba a Dios en su santuario', 'Alaba a Dios en su santuario,
Alabadle en la magnificencia de su firmamento.
Alabadle por sus proezas,
Alabadle conforme a la muchedumbre de su grandeza.

Alabadle con sonido de bocina,
Alabadle con salterio y arpa.
Todo lo que respira alabe a Jehová,
¡Aleluya, alabad a Jehová!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantaré a Jehová un cántico nuevo', 'Cantaré a Jehová un cántico nuevo,
Cantaré a Jehová toda la tierra.
Cantad a Jehová, bendecid su nombre,
Proclamad de día en día su salvación.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tributad a Jehová gloria y poder', 'Tributad a Jehová, oh familias de los pueblos,
Tributad a Jehová la gloria debida a su nombre.
Traed ofrendas y venid a sus atrios,
Adorad a Jehová en la hermosura de la santidad.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gozo del Señor es mi fortaleza', 'El gozo del Señor es mi fortaleza,
El gozo del Señor es mi fortaleza,
El gozo del Señor es mi fortaleza,
Y su gozo sin medida él me da.

Si tienes ese gozo puedes tú cantar,
Si tienes ese gozo puedes tú orar,
Si tienes ese gozo puedes alabar,
Y su gozo sin medida él te da.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabad a Dios con pandero y danza', 'Alabad a Dios con pandero y danza,
Alabadle con cuerdas y flautas.
Alabadle con címbalos resonantes,
Alabadle con címbalos de júbilo.

Todo lo que respira alabe a Jehová,
Todo lo que respira alabe al Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo sé que mi Redentor vive', 'Yo sé que mi Redentor vive,
Y al fin sobre la tierra se levantará.
Y aunque deshecha esté esta mi piel,
En mi carne he de ver a Dios.

Al cual veré por mí mismo,
Y mis ojos lo verán y no otro,
Aunque mi corazón desfallece dentro de mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cosas mayores que estas verás', 'Cosas mayores que estas verás,
Cosas mayores que estas verás.
Si tan solo creyeres de corazón,
Cosas mayores que estas verás.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor marchando va', 'El Señor marchando va,
Y su pueblo junto a él está.
Su gloria en nuestras vidas brillará,
Su victoria nos alcanzará.

Alabemos al Rey de reyes,
Glorifiquemos al Salvador.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es mi fortaleza y mi cántico', 'Jehová es mi fortaleza y mi cántico,
Y ha sido mi salvación.
Este es mi Dios, y lo alabaré;
Dios de mi padre, y lo enalteceré.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No temáis, estad firmes', 'No temáis, estad firmes,
Y ved la salvación que Jehová hará hoy con vosotros.
Porque los egipcios que hoy habéis visto,
Nunca más para siempre los veréis.

Jehová peleará por vosotros,
Y vosotros estaréis tranquilos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantaré de tu poder', 'Cantaré de tu poder,
Y alabaré de mañana tu misericordia.
Porque has sido mi amparo y refugio
En el día de mi angustia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fortaleza mía, a ti cantaré', 'Fortaleza mía, a ti cantaré;
Porque eres, Dios, mi amparo,
El Dios de mi misericordia.

Líbrame de mis enemigos, oh Dios mío,
Ponme a salvo de los que se levantan contra mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aclamad a Dios con alegría', 'Aclamad a Dios con alegría, toda la tierra.
Cantad la gloria de su nombre;
Poned gloria en su alabanza.
Decid a Dios: ¡Cuán asombrosas son tus obras!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendeciré a Jehová en todo tiempo', 'Bendeciré a Jehová en todo tiempo;
Su alabanza estará de continuo en mi boca.
En Jehová se gloriará mi alma;
Lo oirán los mansos, y se alegrarán.

Engrandeced a Jehová conmigo,
Y exaltemos a una su nombre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Busqué a Jehová, y él me oyó', 'Busqué a Jehová, y él me oyó,
Y me libró de todos mis temores.
Los que miraron a él fueron alumbrados,
Y sus rostros no fueron avergonzados.

Este pobre clamó, y le oyó Jehová,
Y lo libró de todas sus angustias.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El ángel de Jehová acampa alrededor', 'El ángel de Jehová acampa alrededor
De los que le temen, y los defiende.
Gustad, y ved que es bueno Jehová;
Dichoso el hombre que confía en él.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cercano está Jehová a los quebrantados de corazón', 'Cercano está Jehová a los quebrantados de corazón;
Y salva a los contritos de espíritu.
Muchas son las aflicciones del justo,
Pero de todas ellas le librará Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Claman los justos, y Jehová oye', 'Claman los justos, y Jehová oye,
Y los libra de todas sus angustias.
Jehová redime el alma de sus siervos,
Y no serán condenados cuantos en él confían.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es mi roca y mi fortaleza', 'Jehová es mi roca y mi fortaleza,
Mi libertador; Dios mío, fortaleza mía,
En él confiaré; mi escudo,
Y la fuerza de mi salvación, mi alto refugio.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Invocaré a Jehová, quien es digno de ser alabado', 'Invocaré a Jehová, quien es digno de ser alabado,
Y seré salvo de mis enemigos.
Me rodearon ligaduras de muerte,
Y torrentes de perversidad me atemorizaron.

En mi angustia invoqué a Jehová,
Y clamé a mi Dios.
Él oyó mi voz desde su templo,
Y mi clamor llegó delante de él, a sus oídos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios es nuestro amparo y fortaleza', 'Dios es nuestro amparo y fortaleza,
Nuestro pronto auxilio en las tribulaciones.
Por tanto, no temeremos, aunque la tierra sea removida,
Y se traspasen los montes al corazón del mar.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Estad quietos, y conoced que yo soy Dios', 'Estad quietos, y conoced que yo soy Dios;
Seré exaltado entre las naciones;
Enaltecido seré en la tierra.
Jehová de los ejércitos está con nosotros;
Nuestro refugio es el Dios de Jacob.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pueblos todos, batid las manos', 'Pueblos todos, batid las manos;
Aclamad a Dios con voz de júbilo.
Porque Jehová el Altísimo es temible;
Rey grande sobre toda la tierra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantad a Dios, cantad', 'Cantad a Dios, cantad;
Cantad a nuestro Rey, cantad;
Porque Dios es el Rey de toda la tierra;
Cantad con inteligencia.

Reinó Dios sobre las naciones;
Se sienta Dios sobre su santo trono.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grande es Jehová, y digno de suprema alabanza', 'Grande es Jehová, y digno de ser en gran manera alabado
En la ciudad de nuestro Dios, en su monte santo.
Hermosa provincia, el gozo de toda la tierra,
Es el monte de Sión, a los lados del norte,
La ciudad del gran Rey.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Oíd esto, pueblos todos', 'Oíd esto, pueblos todos;
Escuchad, habitantes todos del mundo,
Así los plebeyos como los nobles,
El rico y el pobre juntamente.
Mi boca hablará sabiduría,
Y el pensamiento de mi corazón entendimiento.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Dios de dioses, Jehová, ha hablado', 'El Dios de dioses, Jehová, ha hablado,
Y convocado la tierra, desde el nacimiento del sol
Hasta donde se pone.
De Sión, perfección de hermosura,
Dios ha resplandecido.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sacrifica a Dios alabanza', 'Sacrifica a Dios alabanza,
Y paga tus votos al Altísimo;
E invócame en el día de la angustia;
Te libraré, y tú me honrarás.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ten piedad de mí, oh Dios', 'Ten piedad de mí, oh Dios, conforme a tu misericordia;
Conforme a la multitud de tus piedades
Borra mis rebeliones.
Lávame más y más de mi maldad,
Y límpiame de mi pecado.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Crea en mí, oh Dios, un corazón limpio', 'Crea en mí, oh Dios, un corazón limpio,
Y renueva un espíritu recto dentro de mí.
No me eches de delante de ti,
Y no quites de mí tu santo Espíritu.

Vuélveme el gozo de tu salvación,
Y espíritu noble me sustente.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Los sacrificios de Dios son el espíritu quebrantado', 'Los sacrificios de Dios son el espíritu quebrantado;
Al corazón contrito y humillado
No despreciarás tú, oh Dios.
Haz bien con tu benevolencia a Sión;
Edifica los muros de Jerusalén.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo como olivo verde en la casa de Dios', 'Pero yo estoy como olivo verde en la casa de Dios;
En la misericordia de Dios confío
Eternamente y para siempre.
Te alabaré para siempre, porque lo has hecho así;
Y esperaré en tu nombre, porque es bueno.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Salva a tu pueblo, y bendice a tu heredad', 'Salva a tu pueblo, y bendice a tu heredad;
Y pastoréales y susténtales para siempre.
A ti clamaré, oh Jehová.
Roca mía, no te desentiendas de mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La voz de Jehová sobre las aguas', 'Voz de Jehová sobre las aguas;
Truena el Dios de gloria,
Jehová sobre las muchas aguas.
Voz de Jehová con potencia;
Voz de Jehová con gloria.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová dará poder a su pueblo', 'Jehová dará poder a su pueblo;
Jehová bendecirá a su pueblo con paz.
Tributad a Jehová la gloria debida a su nombre;
Adorad a Jehová en la hermosura de la santidad.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te ensalzaré, oh Jehová, porque me has levantado', 'Te ensalzaré, oh Jehová, porque me has levantado,
Y no permitiste que mis enemigos se alegraran de mí.
Jehová Dios mío, clamé a ti, y me sanaste.
Oh Jehová, hiciste subir mi alma del Seol;
Me diste vida, para que no descendiese a la sepultura.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantad a Jehová, vosotros sus santos', 'Cantad a Jehová, vosotros sus santos,
Y celebrad la memoria de su santidad.
Porque un momento será su ira,
Pero su favor dura toda la vida.

Por la noche durará el lloro,
Y a la mañana vendrá la alegría.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En ti, oh Jehová, he confiado', 'En ti, oh Jehová, he confiado; no sea yo confundido jamás;
Líbrame en tu justicia.
Inclina a mí tu oído, líbrame pronto;
Sé tú mi roca fuerte, y fortaleza para salvarme.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sé fuerte y valiente', 'Sé fuerte y valiente, no temas ni desmayes,
Porque Jehová tu Dios estará contigo
Dondequiera que vayas.

No temas los gigantes, no temas el mar,
Que la diestra de Dios te sostendrá.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Caminando por la senda voy', 'Caminando por la senda voy,
De la mano de mi Salvador.
Aunque oscura sea la noche aquí,
Su luz brillante brillará en mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una cosa he demandado a Jehová', 'Una cosa he demandado a Jehová,
Ésta buscaré:
Que esté yo en la casa de Jehová
Todos los días de mi vida.

Para contemplar la hermosura de Jehová,
Y para inquirir en su santo templo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pacientemente esperé a Jehová', 'Pacientemente esperé a Jehová,
Y se inclinó a mí, y oyó mi clamor.
Y me hizo sacar del pozo de la desesperación,
Del lodo cenagoso;
Puso mis pies sobre peña, y enderezó mis pasos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Puso luego en mi boca cántico nuevo', 'Puso luego en mi boca cántico nuevo,
Alabanza a nuestro Dios.
Verán esto muchos, y temerán,
Y confiarán en Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bienaventurado el que piensa en el pobre', 'Bienaventurado el que piensa en el pobre;
En el día malo lo librará Jehová.
Jehová lo guardará, y le dará vida;
Será bienaventurado en la tierra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Como el ciervo brama por las corrientes', 'Como el ciervo brama por las corrientes de las aguas,
Así clama por ti, oh Dios, el alma mía.
Mi alma tiene sed de Dios, del Dios vivo;
¿Cuándo vendré, y me presentaré delante de Dios?', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fueron mis lágrimas mi pan de día y de noche', 'Fueron mis lágrimas mi pan de día y de noche,
Mientras me dicen todos los días: ¿Dónde está tu Dios?
Me acuerdo de estas cosas, y derramo mi alma dentro de mí;
De cómo yo iba con la multitud, y la conducía hasta la casa de Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('¿Por qué te abates, oh alma mía?', '¿Por qué te abates, oh alma mía,
Y te turbas dentro de mí?
Espera en Dios; porque aún he de alabarle,
Salvación mía y Dios mío.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Envía tu luz y tu verdad', 'Envía tu luz y tu verdad; éstas me guiarán;
Me conducirán a tu santo monte,
Y a tus moradas.
Entraré al altar de Dios,
Al Dios de mi alegría y de mi gozo;
Y te alabaré con arpa, oh Dios, Dios mío.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios es el Rey de toda la tierra', 'Dios es el Rey de toda la tierra,
Cantad con gozo, cantad con poder.
Él reina sobre las naciones,
Sentado está en su santo trono.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aplaudiendo con las manos', 'Aplaudiendo con las manos,
Alabando con la voz,
Celebremos la victoria
De Jesús el Salvador.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Los que confían en Jehová', 'Los que confían en Jehová
Son como el monte de Sión,
Que no se mueve, sino que permanece
Para siempre.

Como Jerusalén tiene montes alrededor de ella,
Así Jehová está alrededor de su pueblo
Desde ahora y para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuando Jehová hiciere volver la cautividad', 'Cuando Jehová hiciere volver la cautividad de Sión,
Seremos como los que sueñan.
Entonces nuestra boca se llenará de risa,
Y nuestra lengua de alabanza.

Grandes cosas ha hecho Jehová con nosotros;
Estaremos alegres.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Los que sembraron con lágrimas', 'Los que sembraron con lágrimas,
Con regocijo segarán.
Irá andando y llorando el que lleva la preciosa semilla;
Mas volverá a venir con regocijo, trayendo sus gavillas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si Jehová no edificare la casa', 'Si Jehová no edificare la casa,
En vano trabajan los que la edifican.
Si Jehová no guardare la ciudad,
En vano vela la guardia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bienaventurado todo aquel que teme a Jehová', 'Bienaventurado todo aquel que teme a Jehová,
Que anda en sus caminos.
Cuando comieres el trabajo de tus manos,
Bienaventurado serás, y te irá bien.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu mujer será como vid que lleva fruto', 'Tu mujer será como vid que lleva fruto
A los lados de tu casa;
Tus hijos como plantas de olivo
Alrededor de tu mesa.
He aquí que así será bendecido el hombre
Que teme a Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendígate Jehová desde Sión', 'Bendígate Jehová desde Sión,
Y veas el bien de Jerusalén todos los días de tu vida,
Y veas a los hijos de tus hijos.
Paz sea sobre Israel.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mucho me han angustiado desde mi juventud', 'Mucho me han angustiado desde mi juventud,
Puede decir ahora Israel;
Mucho me han angustiado desde mi juventud,
Mas no prevalecieron contra mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('De lo profundo, oh Jehová, a ti clamo', 'De lo profundo, oh Jehová, a ti clamo.
Señor, oye mi voz;
Estén atentos tus oídos
A la voz de mi súplica.

Si mirares a los pecados, ¿quién podrá mantenerse?
Pero en ti hay perdón, para que seas temido.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma espera a Jehová', 'Mi alma espera a Jehová
Más que los centinelas a la mañana,
Más que los vigilantes a la mañana.
Espere Israel a Jehová,
Porque en Jehová hay misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Señor, no se ha envanecido mi corazón', 'Señor, no se ha envanecido mi corazón,
Ni mis ojos se enaltecieron;
Ni anduve en grandezas,
Ni en cosas demasiado sublimes para mí.
En verdad que he sosegado y acallado mi alma
Como un niño destetado de su madre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Acuérdate, oh Jehová, de David', 'Acuérdate, oh Jehová, de David,
Y de toda su aflicción;
De cómo juró a Jehová,
Y prometió al Fuerte de Jacob:
No entraré en la morada de mi casa
Hasta que halle lugar para Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levántate, oh Jehová, al lugar de tu reposo', 'Levántate, oh Jehová, al lugar de tu reposo,
Tú y el arca de tu poder.
Tus sacerdotes se vistan de justicia,
Y se regocijen tus santos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mirad, bendecid a Jehová', 'Mirad, bendecid a Jehová,
Vosotros todos los siervos de Jehová,
Los que en la casa de Jehová estáis por las noches.
Alzad vuestras manos al santuario,
Y bendecid a Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Desde Sión te bendiga Jehová', 'Desde Sión te bendiga Jehová,
El cual ha hecho los cielos y la tierra.
Alabad el nombre de Jehová;
Alabadle, siervos de Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabad a Jehová, porque él es bueno; cantad salmos', 'Alabad a Jehová, porque él es bueno;
Cantad salmos a su nombre, porque es benigno.
Porque Jehová ha escogido a Jacob para sí,
A Israel por posesión suya.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo sé que Jehová es grande', 'Porque yo sé que Jehová es grande,
Y el Señor nuestro, mayor que todos los dioses.
Todo lo que Jehová quiere, lo hace,
En los cielos y en la tierra, en los mares y en todos los abismos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hace subir las nubes desde los extremos de la tierra', 'Él hace subir las nubes de los extremos de la tierra;
Hace los relámpagos para la lluvia;
Saca los vientos de sus depósitos.
Tu nombre, oh Jehová, permanece para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Los ídolos de las naciones son plata y oro', 'Los ídolos de las naciones son plata y oro,
Obra de manos de hombres.
Tienen boca, y no hablan;
Tienen ojos, y no ven;
Tienen orejas, y no oyen;
Tampoco hay aliento en sus bocas.
Semejantes a ellos son los que los hacen.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Casa de Israel, bendecid a Jehová', 'Casa de Israel, bendecid a Jehová;
Casa de Aarón, bendecid a Jehová;
Casa de Leví, bendecid a Jehová;
Los que teméis a Jehová, bendecid a Jehová.
Bendito desde Sión sea Jehová,
El cual mora en Jerusalén. ¡Aleluya!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabad a Jehová, porque su misericordia es para siempre', 'Alabad a Jehová, porque él es bueno,
Porque para siempre es su misericordia.
Alabad al Dios de los dioses,
Porque para siempre es su misericordia.
Alabad al Señor de los señores,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al que solo hace grandes maravillas', 'Al único que hace grandes maravillas,
Porque para siempre es su misericordia.
Al que hizo los cielos con entendimiento,
Porque para siempre es su misericordia.
Al que extendió la tierra sobre las aguas,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al que hizo las grandes lumbreras', 'Al que hizo las grandes lumbreras,
Porque para siempre es su misericordia;
El sol para que señorease en el día,
Porque para siempre es su misericordia;
La luna y las estrellas para que señoreasen en la noche,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al que hirió a Egipto en sus primogénitos', 'Al que hirió a Egipto en sus primogénitos,
Porque para siempre es su misericordia.
Y sacó a Israel de en medio de ellos,
Porque para siempre es su misericordia;
Con mano fuerte, y brazo extendido,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al que dividió el Mar Rojo en partes', 'Al que dividió el Mar Rojo en partes,
Porque para siempre es su misericordia;
E hizo pasar a Israel por medio de él,
Porque para siempre es su misericordia;
Y arrojó a Faraón y a su ejército en el Mar Rojo,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al que pastoreó a su pueblo por el desierto', 'Al que pastoreó a su pueblo por el desierto,
Porque para siempre es su misericordia.
Al que hirió a grandes reyes,
Porque para siempre es su misericordia;
Y mató a reyes poderosos,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él es el que en nuestro abatimiento se acordó de nosotros', 'Él es el que en nuestro abatimiento se acordó de nosotros,
Porque para siempre es su misericordia;
Y nos rescató de nuestros enemigos,
Porque para siempre es su misericordia.
El que da alimento a todo ser viviente,
Porque para siempre es su misericordia.
Alabad al Dios de los cielos,
Porque para siempre es su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Junto a los ríos de Babilonia', 'Junto a los ríos de Babilonia,
Allí nos sentábamos, y aun llorábamos,
Acordándonos de Sión.
Sobre los sauces en medio de ella
Colgábamos nuestras arpas.

¿Cómo cantaremos cántico de Jehová
En tierra de extraños?
Si me olvidare de ti, oh Jerusalén,
Pierda mi diestra su destreza.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te alabaré con todo mi corazón; delante de los dioses', 'Te alabaré con todo mi corazón;
Delante de los dioses te cantaré salmos.
Me postraré hacia tu santo templo,
Y alabaré tu nombre por tu misericordia y tu fidelidad;
Porque has engrandecido tu nombre, y tu palabra sobre todas las cosas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El día que clamé, me respondiste', 'El día que clamé, me respondiste;
Mucho me fortaleciste con vigor en mi alma.
Te alabarán, oh Jehová, todos los reyes de la tierra,
Porque han oído los dichos de tu boca.
Y cantarán de los caminos de Jehová,
Porque la gloria de Jehová es grande.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Porque Jehová es excelso, y atiende al humilde', 'Porque Jehová es excelso, y atiende al humilde,
Mas al altivo mira de lejos.
Si anduviere yo en medio de la angustia, tú me vivificarás;
Contra la ira de mis enemigos extenderás tu mano,
Y me salvará tu diestra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová cumplirá su propósito en mí', 'Jehová cumplirá su propósito en mí;
Tu misericordia, oh Jehová, es para siempre;
No desampares la obra de tus manos.
Clamaré al Dios Altísimo,
Al Dios que me favorece.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Oh Jehová, tú me has examinado y conocido', 'Oh Jehová, tú me has examinado y conocido.
Tú has conocido mi sentarme y mi levantarme;
Has entendido desde lejos mis pensamientos.
Has escudriñado mi andar y mi reposo,
Y todos mis caminos te son conocidos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pues aún no está la palabra en mi lengua', 'Pues aún no está la palabra en mi lengua,
Y he aquí, oh Jehová, tú la sabes toda.
Detrás y delante me rodeaste,
Y sobre mí pusiste tu mano.
Tal conocimiento es demasiado maravilloso para mí;
Alto es, no lo puedo comprender.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('¿A dónde me iré de tu Espíritu?', '¿A dónde me iré de tu Espíritu?
¿Y a dónde huiré de tu presencia?
Si subiere a los cielos, allí estás tú;
Y si en el Seol hiciere mi estrado, he aquí, allí tú estás.

Si tomare las alas del alba
Y habitare en el extremo del mar,
Aun allí me guiará tu mano,
Y me asirá tu diestra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si dijere: Ciertamente las tinieblas me encubrirán', 'Si dijere: Ciertamente las tinieblas me encubrirán;
Aun la noche resplandecerá alrededor de mí.
Lo mismo te son las tinieblas que la luz.
Porque tú formaste mis entrañas;
Tú me hiciste en el vientre de mi madre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te alabaré; porque formidables, maravillosas son tus obras', 'Te alabaré; porque formidables, maravillosas son tus obras;
Estoy maravillado,
Y mi alma lo sabe muy bien.
No fue encubierto de ti mi cuerpo,
Bien que en oculto fui formado.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi embrión vieron tus ojos', 'Mi embrión vieron tus ojos,
Y en tu libro estaban escritas todas aquellas cosas
Que fueron luego formadas,
Sin faltar una de ellas.
¡Cuán preciosos me son, oh Dios, tus pensamientos!
¡Cuán grande es la suma de ellos!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Examíname, oh Dios, y conoce mi corazón', 'Examíname, oh Dios, y conoce mi corazón;
Pruébame y conoce mis pensamientos;
Y ve si hay en mí camino de perversidad,
Y guíame en el camino eterno.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Líbrame, oh Jehová, del hombre malo', 'Líbrame, oh Jehová, del hombre malo;
Guárdame de hombres violentos,
Los cuales maquinan males en el corazón,
Cada día urden contiendas.
Aguzaron su lengua como la serpiente;
Veneno de áspid hay debajo de sus labios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo he dicho a Jehová: Dios mío eres tú', 'Yo he dicho a Jehová: Dios mío eres tú;
Escucha, oh Jehová, la voz de mis ruegos.
Jehová Señor, potente salvador mío,
Tú pusiste a cubierto mi cabeza en el día de batalla.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo sé que Jehová tomará a su cargo el juicio del afligido', 'Yo sé que Jehová tomará a su cargo el juicio del afligido,
Y el derecho de los necesitados.
Ciertamente los justos alabarán tu nombre;
Los rectos morarán en tu presencia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová, a ti he clamado; apresúrate a mí', 'Jehová, a ti he clamado; apresúrate a mí;
Escucha mi voz cuando te invocare.
Suba mi oración delante de ti como el incienso,
El don de mis manos como la ofrenda de la tarde.
Pon guarda a mi boca, oh Jehová;
Guarda la puerta de mis labios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No dejes que se incline mi corazón a cosa mala', 'No dejes que se incline mi corazón a cosa mala,
A hacer obras impías con los hombres que hacen iniquidad;
Y no coma yo de sus deleites.
Que el justo me castigue, será un favor,
Y que me reprenda será un excelente bálsamo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Por tanto, a ti, oh Jehová, Señor, miran mis ojos', 'Por tanto, a ti, oh Jehová, Señor, miran mis ojos;
En ti he confiado; no desampares mi alma.
Guárdame de los lazos que me han tendido,
Y de las trampas de los que hacen iniquidad.
Caigan los impíos a una en sus propias redes,
Mientras yo paso adelante.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con mi voz clamé a Jehová', 'Con mi voz clamé a Jehová;
Con mi voz pedí a Jehová misericordia.
Delante de él expuse mi queja;
Delante de él manifesté mi angustia.
Cuando mi espíritu se angustiaba dentro de mí, tú conociste mi senda.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mira a mi diestra y observa, pues no hay quien me conozca', 'Mira a mi diestra y observa, pues no hay quien me conozca;
No tengo refugio, ni hay quien cuide de mi vida.
Clamé a ti, oh Jehová;
Dije: Tú eres mi esperanza,
Y mi porción en la tierra de los vivientes.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Escucha mi clamor, porque estoy muy afligido', 'Escucha mi clamor, porque estoy muy afligido.
Líbrame de los que me persiguen, porque son más fuertes que yo.
Saca mi alma de la cárcel, para que alabe tu nombre;
Me rodearán los justos,
Porque tú me serás propicio.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Oh Jehová, oye mi oración, escucha mis ruegos', 'Oh Jehová, oye mi oración, escucha mis ruegos;
Respóndeme por tu fidelidad, por tu justicia.
Y no entres en juicio con tu siervo;
Porque no se justificará delante de ti ningún ser viviente.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me acordé de los días antiguos', 'Me acordé de los días antiguos;
Meditaba en todas tus obras;
Reflexionaba en las obras de tus manos.
Extendí mis manos a ti,
Mi alma a ti como la tierra sedienta.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Respóndeme pronto, oh Jehová, porque desmaya mi espíritu', 'Respóndeme pronto, oh Jehová, porque desmaya mi espíritu;
No escondas de mí tu rostro,
No venga yo a ser semejante a los que descienden a la sepultura.
Hazme oír por la mañana tu misericordia,
Porque en ti he confiado.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hazme saber el camino por donde ande', 'Hazme saber el camino por donde ande,
Porque a ti he alzado mi alma.
Líbrame de mis enemigos, oh Jehová;
En ti me refugio.
Enséñame a hacer tu voluntad, porque tú eres mi Dios;
Tu buen espíritu me guíe a tierra de rectitud.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Por tu nombre, oh Jehová, me vivificarás', 'Por tu nombre, oh Jehová, me vivificarás;
Por tu justicia sacarás mi alma de angustia.
Y por tu misericordia disiparás a mis enemigos,
Y destruirás a todos los adversarios de mi alma,
Porque yo soy tu siervo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendito sea Jehová, mi roca', 'Bendito sea Jehová, mi roca,
Quien adiestra mis manos para la batalla,
Y mis dedos para la guerra;
Misericordia mía y mi castillo,
Fortaleza mía y mi libertador,
Escudo mío, en quien he confiado;
El que sujeta a mi pueblo debajo de mí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Oh Dios, a ti cantaré cántico nuevo', 'Oh Dios, a ti cantaré cántico nuevo;
Con salterio, con decacordio cantaré a ti.
Tú, el que da victoria a los reyes,
El que rescata a David su siervo de maligna espada.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sean nuestros hijos como plantas crecidas', 'Sean nuestros hijos como plantas crecidas en su juventud,
Nuestras hijas como esquinas labradas a manera de las de un palacio;
Nuestros graneros llenos, provistos de toda suerte de grano;
Nuestros ganados, que se multipliquen a millares y decenas de millares en nuestros campos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bienaventurado el pueblo cuyo Dios es Jehová', 'Bienaventurado el pueblo que tiene esto;
Bienaventurado el pueblo cuyo Dios es Jehová.
Te exaltaré, mi Dios, mi Rey,
Y bendeciré tu nombre eternamente y para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Generación a generación celebrará tus obras', 'Generación a generación celebrará tus obras,
Y anunciará tus poderosos hechos.
En la hermosura de la gloria de tu magnificencia,
Y en tus hechos maravillosos meditaré.
Del poder de tus hechos estupendos hablarán los hombres,
Y yo publicaré tu grandeza.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Clemente y misericordioso es Jehová', 'Clemente y misericordioso es Jehová,
Lento para la ira, y grande en misericordia.
Bueno es Jehová para con todos,
Y sus misericordias sobre todas sus obras.
Te alaben, oh Jehová, todas tus obras,
Y tus santos te bendigan.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La gloria de tu reino digan, y hablen de tu poder', 'La gloria de tu reino digan, y hablen de tu poder,
Para hacer saber a los hijos de los hombres sus poderosos hechos,
Y la gloria de la magnificencia de su reino.
Tu reino es reino de todos los siglos,
Y tu señorío en todas las generaciones.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sostiene Jehová a todos los que caen', 'Sostiene Jehová a todos los que caen,
Y levanta a todos los oprimidos.
Los ojos de todos esperan en ti,
Y tú les das su comida a su tiempo.
Abres tu mano,
Y colmas de bendición a todo ser viviente.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Justo es Jehová en todos sus caminos', 'Justo es Jehová en todos sus caminos,
Y misericordioso en todas sus obras.
Cercano está Jehová a todos los que le invocan,
A todos los que le invocan de veras.
Cumplirá el deseo de los que le temen;
Oirá asimismo el clamor de ellos, y los salvará.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová guarda a todos los que le aman', 'Jehová guarda a todos los que le aman,
Mas destruirá a todos los impíos.
La alabanza de Jehová proclamará mi boca;
Y todos bendigan su santo nombre
Eternamente y para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alaba, oh alma mía, a Jehová', 'Alaba, oh alma mía, a Jehová.
Alabaré a Jehová en mi vida;
Cantaré salmos a mi Dios mientras viva.
No confiéis en los príncipes,
Ni en hijo de hombre, porque no hay en él salvación.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bienaventurado aquel cuyo ayudador es el Dios de Jacob', 'Bienaventurado aquel cuyo ayudador es el Dios de Jacob,
Cuya esperanza está en Jehová su Dios,
El cual hizo los cielos y la tierra,
El mar, y todo lo que en ellos hay;
Que guarda verdad para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová liberta a los cautivos', 'Jehová da pan a los hambrientos.
Jehová liberta a los cautivos;
Jehová abre los ojos a los ciegos;
Jehová levanta a los caídos;
Jehová ama a los justos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová guarda a los extranjeros', 'Jehová guarda a los extranjeros;
Al huérfano y a la viuda sostiene,
Y el camino de los impíos trastorna.
Reinará Jehová para siempre;
Tu Dios, oh Sión, de generación en generación. ¡Aleluya!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabad a Jehová, porque es bueno cantar salmos', 'Alabad a Jehová, porque es bueno cantar salmos a nuestro Dios;
Porque suave y hermosa es la alabanza.
Jehová edifica a Jerusalén;
A los desterrados de Israel recogerá.
Él sana a los quebrantados de corazón,
Y venda sus heridas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él cuenta el número de las estrellas', 'Él cuenta el número de las estrellas;
A todas ellas llama por sus nombres.
Grande es el Señor nuestro, y de mucho poder;
Y su entendimiento es infinito.
Jehová exalta a los humildes,
Y humilla a los impíos hasta la tierra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantad a Jehová con alabanza', 'Cantad a Jehová con alabanza,
Cantad con arpa a nuestro Dios.
Él es el que cubre de nubes los cielos,
El que prepara la lluvia para la tierra,
El que hace a los montes producir hierba.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él da a la bestia su mantenimiento', 'Él da a la bestia su mantenimiento,
Y a los hijos de los cuervos que claman.
No se deleita en la fuerza del caballo,
Ni se complace en la agilidad del hombre.
Se complace Jehová en los que le temen,
Y en los que esperan en su misericordia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alaba a Jehová, Jerusalén; alaba a tu Dios, oh Sión', 'Alaba a Jehová, Jerusalén;
Alaba a tu Dios, oh Sión.
Porque fortaleció los cerrojos de tus puertas;
Bendijo a tus hijos dentro de ti.
Él da paz en tu territorio;
Te saciará con lo mejor del trigo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él envía su palabra a la tierra', 'Él envía su palabra a la tierra;
Velozmente corre su palabra.
Da la nieve como lana,
Y derrama la escarcha como ceniza.
Echa su hielo como pedazos;
Ante su frío, ¿quién resistirá?
Envía su palabra, y los derrite;
Hace soplar su viento, y fluyen las aguas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabad a Jehová desde los cielos', 'Alabad a Jehová desde los cielos;
Alabadle en las alturas.
Alabadle, vosotros todos sus ángeles;
Alabadle, vosotros todos sus ejércitos.
Alabadle, sol y luna;
Alabadle, vosotras todas, lucientes estrellas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alaben el nombre de Jehová; porque él mandó', 'Alaben el nombre de Jehová;
Porque él mandó, y fueron creados.
Los hizo ser eternamente y para siempre;
Les puso ley que no será quebrantada.
Alabad a Jehová desde la tierra,
Los monstruos marinos y todos los abismos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Reyes de la tierra y todos los pueblos', 'Reyes de la tierra y todos los pueblos,
Príncipes y todos los jueces de la tierra;
Los jóvenes y también las doncellas,
Los ancianos y los niños.
Alaben el nombre de Jehová,
Porque sólo su nombre es enaltecido.
Su gloria es sobre tierra y cielos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantad a Jehová cántico nuevo; su alabanza en la congregación', 'Cantad a Jehová cántico nuevo;
Su alabanza sea en la congregación de los santos.
Alégrese Israel en su Hacedor;
Los hijos de Sión se gocen en su Rey.
Alaben su nombre con danza;
Con pandero y arpa a él canten.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Porque Jehová tiene contentamiento en su pueblo', 'Porque Jehová tiene contentamiento en su pueblo;
Hermoseará a los humildes con la salvación.
Regocíjense los santos por su gloria,
Y canten aun sobre sus camas.
Exalten a Dios con sus gargantas,
Y espadas de dos filos en sus manos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Para ejecutar en ellos el juicio decretado', 'Para ejecutar en ellos el juicio decretado;
Gloria sea esta para todos sus santos.
Alabad a Dios en su santuario;
Alabadle en la magnificencia de su firmamento.
¡Aleluya!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabadle por sus proezas; alabadle conforme a su grandeza', 'Alabadle por sus proezas;
Alabadle conforme a la muchedumbre de su grandeza.
Alabadle a son de bocina;
Alabadle con salterio y arpa.
Alabadle con pandero y danza;
Alabadle con cuerdas y flautas.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Todo lo que respira alabe a Jehová', 'Alabadle con címbalos resonantes;
Alabadle con címbalos de júbilo.
Todo lo que respira alabe a Jehová.
¡Aleluya! ¡Gloria a Dios!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo no sé a lo que tú has venido', 'Yo no sé a lo que tú has venido,
Pero yo vine a alabar a Dios.
Yo no sé a lo que tú has venido,
Pero yo vine a alabar a Dios.

¡Aleluya, aleluya!
Yo vine a alabar a Dios.
¡Aleluya, aleluya!
Yo vine a alabar a Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No puede estar triste el corazón que alaba a Cristo', 'No puede estar triste el corazón que alaba a Cristo,
No puede estar triste el corazón que alaba a Dios.
No puede estar triste el corazón que alaba a Cristo,
No puede estar triste el corazón que alaba a Dios.

Por eso yo canto, yo canto aleluya,
No puede estar triste el corazón que alaba a Dios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si tú quieres sentir el Espíritu de Dios', 'Si tú quieres sentir el Espíritu de Dios,
Olvídate del problema y de las cosas de allá.

Alaba a Dios, alaba a Dios,
Alaba a Dios y siéntelo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué bonito es alabar al Señor', 'Qué bonito es, qué bonito es
Alabar al Señor.
Qué bonito es, qué bonito es
Cantarle su loor.

Ven hermano, alaba a Cristo,
Porque él es tu Salvador.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Este gozo que yo siento en mi alma', 'Este gozo que yo siento en mi alma,
Solo Cristo me lo pudo dar.
Este gozo que yo siento en mi alma,
Solo Cristo me lo pudo dar.

Solo Cristo me lo pudo dar,
Solo Cristo me lo pudo dar.
Pero qué gozo, pero qué gozo,
Solo Cristo me lo pudo dar.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo tengo gozo en mi alma y en mi ser', 'Yo tengo gozo en mi alma,
Gozo en mi alma,
Gozo en mi alma y en mi ser.

Es como ríos de agua viva,
Ríos de agua viva,
Ríos de agua viva en mi ser.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Paz como un río', 'Tengo paz como un río,
Tengo paz como un río,
Tengo paz como un río en mi ser.

Tengo gozo como una fuente,
Tengo gozo como una fuente,
Tengo gozo como una fuente en mi ser.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El amor de Dios es maravilloso', 'El amor de Dios es maravilloso,
El amor de Dios es maravilloso,
El amor de Dios es maravilloso,
¡Grande es el amor de Dios!

Tan alto que no puedo estar arriba de él,
Tan bajo que no puedo estar debajo de él,
Tan ancho que no puedo estar afuera de él,
¡Grande es el amor de Dios!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si tuvieras fe como un grano de mostaza', 'Si tuvieras fe como un grano de mostaza,
Eso lo dice el Señor.
Si tuvieras fe como un grano de mostaza,
Eso lo dice el Señor.

Tú le dirías a esa montaña:
Muévete, muévete.
Y la montaña se moverá,
Se moverá, se moverá.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Zaqueo era un hombre pequeñito', 'Zaqueo era un hombre pequeñito así,
Que vivía en Jericó.
Y cuando Jesús por allí pasó,
A un sicómoro él se subió.

El Salvador le miró y le dijo:
¡Zaqueo, baja deprisa!
Porque hoy es necesario que pose yo en tu casa.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sansón era un muchacho fuerte', 'Sansón era un muchacho así de fuerte,
Tenía mucha fuerza en sus brazos.
Vino un leoncito y le rugió:
¡Grrr, grrr, grrr!
Y Sansón lo desgarró con su poder.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gedeón y los trescientos valientes', 'Con trescientos hombres valientes de Dios,
Gedeón marchó contra Madián.
Con cántaros, teas y trompetas sonando,
¡Por la espada de Jehová y de Gedeón!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Elías oraba en el monte Carmelo', 'Elías oraba en el monte Carmelo,
Para que descendiera el fuego del cielo.
Y cuando oró, el fuego cayó,
Consumió el holocausto y el pueblo creyó:
¡Jehová es el Dios, Jehová es el Dios!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Moisés y la serpiente en el desierto', 'Moisés en el desierto la serpiente levantó,
Para que todo aquel que mirase viviera.
Así fue levantado Cristo en la cruz,
Para darnos salvación y eterna luz.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A la casa de Jairo iba el Maestro', 'A la casa de Jairo iba el Maestro,
Una gran multitud le apretujaba.
Una mujer con fe tocó su manto,
Y al instante la virtud de Dios la sanó.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bartimeo el ciego de Jericó', 'Bartimeo el ciego clamaba al pasar:
¡Hijo de David, ten misericordia de mí!
Muchos le decían que se callara ya,
Pero él clamaba: ¡Ten misericordia de mí!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Lázaro sal fuera del sepulcro', 'Cuatro días en el sepulcro Lázaro yacía,
Marta y María lloraban de dolor.
Jesús alzó su voz con autoridad y gloria:
¡Lázaro, sal fuera! Y resucitó.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pedro y Juan en la puerta Hermosa', 'Pedro y Juan subían al templo a orar,
A la hora novena de la oración.
Un hombre cojo pedía limosna,
Esperando recibir alguna bendición.

Pedro le dijo: No tengo plata ni oro,
Mas lo que tengo te doy:
En el nombre de Jesús de Nazaret,
¡Levántate y anda! Y el cojo saltó.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pablo y Silas a la medianoche', 'Pablo y Silas en la cárcel cantaban alabanzas,
A la medianoche oraban al Señor.
Vino un terremoto, las puertas se abrieron,
Las cadenas de los presos al suelo cayeron.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soldado soy del ejército de Dios', 'Aunque no marche en la infantería,
Caballería, artillería;
Aunque en avión no vaya volando,
Pero soldado soy.

¡Soldado soy de Jesús!
¡Soldado soy de Jesús!
Aunque no marche en la infantería,
Pero soldado soy.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Dios es real, lo siento en mi alma', 'Mi Dios es real, real en mi ser,
Él me ha lavado con su sangre carmesí.
Su dulce amor es para mí,
Mi Dios es real porque lo siento en mi ser.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A que tú te vas, a que yo también', 'A que tú te vas, a que yo también,
Para la nueva Jerusalén.
A que tú te vas, a que yo también,
Para la nueva Jerusalén.

Allá no habrá llanto, no habrá dolor,
Estaremos en la presencia del Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué lindo es mi Cristo', 'Qué lindo es mi Cristo, cuán grande es su amor,
Murió en el Calvario para darme perdón.
Su sangre preciosa vertió en el madero,
Por eso le alabo con gozo sincero.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo me gozo el lunes y el martes también', 'Yo me gozo el lunes, el martes también,
El miércoles y el jueves me gozo con él.
El viernes y el sábado le alabo sin fin,
Y el domingo en el culto me gozo feliz.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alguien me tocó de parte del Señor', 'Alguien me tocó, alguien me tocó,
Fue la mano del Señor que me tocó.
Estaba ciego y ahora veo,
Fue la mano del Señor que me tocó.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es mi roca y mi salvación', 'Cristo es mi roca y mi fortaleza,
Mi libertador en quien confiaré.
Él es mi escudo, la fuerza de mi salvación,
Mi alto refugio y mi defensor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Caminando voy para Canaán', 'Caminando voy para Canaán,
Caminando voy para Canaán.
Caminando voy para Canaán,
¡Gloria a Dios, caminando voy para Canaán!

Si tú no vas, no me impidas a mí,
Porque yo voy para Canaán.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo le alabo de corazón y con mi voz', 'Yo le alabo de corazón,
Yo le alabo con mi voz.
Yo le alabo de corazón,
Yo le alabo con mi voz.

Y si me falta la voz,
Yo le alabo con las manos.
Y si me faltan las manos,
Yo le alabo con los pies.
Y si me faltan los pies,
Yo le alabo con el alma.
Y si me faltara el alma,
Es que ya me fui con él.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Dios está en los cielos', '¿Dónde, dónde está tu Dios?
¿Dónde, dónde está tu Dios?
Mi Dios está en el cielo y también en mi corazón.
El tuyo está muerto y el mío resucitó.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Eran ciento veinte en Pentecostés', 'Eran ciento veinte en un aposento alto,
Todos esperando la promesa del Señor.
Y de repente vino un estruendo del cielo,
Como de un viento recio que llenó aquel lugar.

Y fueron todos llenos del Espíritu Santo,
Hablando en nuevas lenguas la gloria del Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios habita en medio de la alabanza', 'En el salmo veintidós la biblia lo dice:
Dios habita en medio de la alabanza.
Si tú le alabas, él se manifiesta,
Si tú le alabas, derrama su gracia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo sé que estás aquí, bendito Salvador', 'Yo sé que estás aquí, mi Señor,
Yo sé que estás aquí.
Mi alma te anhela, mi corazón te busca,
Yo sé que estás aquí.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Su gloria cubrió los cielos de majestad', 'Su gloria cubrió los cielos,
Y la tierra se llenó de su alabanza.
Y el resplandor fue como la luz,
Rayos brillantes salían de sus manos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mirad qué amor tan grande nos ha dado el Padre', 'Mirad qué amor nos ha dado el Padre,
Al hacernos hijos de Dios.
Por eso el mundo no nos conoce,
Porque tampoco le conoció a él.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gozo que tengo el mundo no me lo dio', 'El gozo que tengo yo
El mundo no me lo dio.
El mundo no me lo dio,
Y como no me lo dio,
No me lo puede quitar.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Si el enemigo toca a tu corazón', 'Si el enemigo toca a tu corazón
Y te dice: Déjame entrar.
Dile: ¡No, no, no! Cristo vive en mí
Y no hay lugar para ti.

Si Cristo toca a tu corazón
Y te dice: Déjame entrar.
Dile: ¡Sí, sí, sí! Cristo vive en mí
Y bienvenido serás.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hacer de mí un vaso nuevo', 'Quiero ser, Señor, como el barro en manos del alfarero,
Toma mi vida y hazla de nuevo.
Yo quiero ser un vaso nuevo,
Lleno de tu Espíritu y de tu gracia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A ti atribuimos la gloria y majestad', 'A ti atribuimos la gloria,
A ti atribuimos la honra.
A ti atribuimos poder y majestad,
Santo es el Señor.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al Rey de reyes y Señor de señores gloria', 'Al Rey de reyes, Señor de señores,
Gloria, aleluya.
Cristo, Príncipe de paz,
Gloria, aleluya.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aclamad al Señor de toda la tierra', 'Aclamad al Señor con alegría,
Cantad un cántico nuevo.
Porque grande es el Señor y digno de suprema alabanza,
Él es sobre todos los dioses.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendeciré a Jehová por su misericordia', 'Bendeciré a Jehová porque él ha sido bueno,
Ha derramado sobre mí su bendición.
Mis labios cantarán de su misericordia,
Y proclamaré su gran fidelidad.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantaré al Señor mientras viva', 'Cantaré al Señor toda mi vida,
Cantaré salmos a mi Dios mientras viva.
Dulce será mi meditación en él,
Yo me alegraré en Jehová.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Como árbol plantado junto a corrientes', 'Como árbol plantado junto a corrientes de agua,
Que da su fruto a su tiempo y su hoja no cae.
Así será el que medita en la ley del Señor,
Todo lo que hace prosperará.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('De Jehová es la tierra y su plenitud santa', 'De Jehová es la tierra y su plenitud,
El mundo y los que en él habitan.
Porque él la fundó sobre los mares,
Y la afirmó sobre los ríos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alzad, oh puertas eternas, vuestras cabezas', 'Alzad, oh puertas, vuestras cabezas,
Y alzaos vosotras, puertas eternas,
Y entrará el Rey de gloria.

¿Quién es este Rey de gloria?
Jehová el fuerte y valiente,
Jehová el poderoso en batalla.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor es la defensa de mi vida', 'El Señor es mi luz y mi salvación,
¿A quién temeré?
El Señor es la defensa de mi vida,
¿De quién tendré temor?', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En Dios solamente descansa mi alma fiel', 'En Dios solamente descansa mi alma,
De él viene mi salvación.
Él solamente es mi roca y mi fortaleza,
Es mi refugio, no resbalaré jamás.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios, de madrugada te buscaré', 'Dios, Dios mío eres tú, de madrugada te buscaré,
Mi alma tiene sed de ti, mi carne te anhela,
En tierra seca y árida donde no hay aguas,
Para ver tu poder y tu gloria.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Porque mejor es tu misericordia que la vida misma', 'Porque mejor es tu misericordia que la vida,
Mis labios te alabarán.
Así te bendeciré en mi vida,
En tu nombre alzaré mis manos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aclamen a Dios con gritos de victoria', 'Aclamen a Dios con gritos de júbilo,
Canten la gloria de su nombre.
Digan a Dios: ¡Cuán temibles son tus obras!
Toda la tierra te adorará.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendice, alma mía, al Señor Jehová', 'Bendice, alma mía, a Jehová,
Y bendiga todo mi ser su santo nombre.
Bendice, alma mía, a Jehová,
Y no olvides ninguno de sus beneficios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él perdona todas tus iniquidades', 'Él es quien perdona todas tus iniquidades,
El que sana todas tus dolencias.
El que rescata del hoyo tu vida,
El que te corona de favores y misericordias.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él sacia de bien tu boca con bendición', 'El que sacia de bien tu boca,
De modo que te rejuvenezcas como el águila.
Jehová es el que hace justicia
Y derecho a todos los que padecen violencia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Lento para la ira y grande en misericordia', 'Misericordioso y clemente es Jehová,
Lento para la ira y grande en misericordia.
No contenderá para siempre,
Ni para siempre guardará el enojo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuanto dista el oriente del occidente', 'Cuanto está lejos el oriente del occidente,
Hizo alejar de nosotros nuestras rebeliones.
Como el padre se compadece de los hijos,
Se compadece Jehová de los que le temen.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él conoce nuestra débil condición', 'Porque él conoce nuestra condición,
Se acuerda de que somos polvo.
El hombre, como la hierba son sus días,
Florece como la flor del campo.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La misericordia de Jehová es desde el siglo', 'Mas la misericordia de Jehová
Es desde el siglo y hasta el siglo
Sobre los que le temen,
Y su justicia sobre los hijos de los hijos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová estableció su trono en las alturas', 'Jehová estableció en los cielos su trono,
Y su reino domina sobre todos.
Bendecid a Jehová, vosotros sus ángeles,
Poderosos en fortaleza, que ejecutáis su palabra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendecid al Señor todos sus ejércitos', 'Bendecid a Jehová, todos sus ejércitos,
Ministros suyos, que hacéis su voluntad.
Bendecid a Jehová, todas sus obras,
En todos los lugares de su señorío.
¡Bendice, alma mía, a Jehová!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Abre mis ojos a las maravillas de tu ley', 'Abre mis ojos, y miraré
Las maravillas de tu ley.
Forastero soy yo en la tierra;
No encubras de mí tus mandamientos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Lámpara a mis pies es tu palabra', 'Lámpara es a mis pies tu palabra,
Y lumbrera a mi camino.
Juré y ratifiqué
Que guardaré tus justos juicios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La revelación de tus palabras da luz', 'La exposición de tus palabras alumbra;
Hace entender a los simples.
Mi boca abrí y suspiré,
Porque deseaba tus mandamientos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ordena mis pasos conforme a tu verdad', 'Ordena mis pasos con tu palabra,
Y ninguna iniquidad se enseñoree de mí.
Líbrame de la violencia de los hombres,
Y guardaré tus mandamientos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Haz resplandecer tu rostro sobre tu siervo hoy', 'Haz resplandecer tu rostro sobre tu siervo,
Y enséñame tus estatutos.
Ríos de agua descendieron de mis ojos,
Porque no guardaban tu ley.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Justo eres tú, oh Dios eterno', 'Justo eres tú, oh Jehová,
Y rectos son tus juicios.
Tus testimonios, que has recomendado,
Son muy rectos y muy fieles.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pura y santa es tu palabra, Señor', 'Sumamente pura es tu palabra,
Y la ama tu siervo.
Pequeño soy yo, y desechado,
Mas no me he olvidado de tus mandamientos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu justicia es justicia para siempre', 'Tu justicia es justicia eterna,
Y tu ley la verdad.
Aflicción y angustia se han apoderado de mí,
Mas tus mandamientos fueron mis delicias.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Clamé de todo corazón ante tu altar', 'Clamé con todo mi corazón;
Respóndeme, oh Jehová, y guardaré tus estatutos.
A ti clamé; sálvame,
Y guardaré tus testimonios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me anticipé al alba para buscar tu faz', 'Me anticipé al alba, y clamé;
Esperé en tu palabra.
Se anticiparon mis ojos a las vigilias de la noche,
Para meditar en tus mandatos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La suma de tu palabra es la verdad', 'Muchos son tus testimonios, oh Jehová;
Vivifícame conforme a tus juicios.
La suma de tu palabra es verdad,
Y eterno es todo juicio de tu justicia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gran paz tienen los que aman tu ley', 'Mucha paz tienen los que aman tu ley,
Y no hay para ellos tropiezo.
Tu salvación he esperado, oh Jehová,
Y tus mandamientos he puesto por obra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Llegue mi clamor a tu presencia, oh Rey', 'Llegue mi clamor delante de ti, oh Jehová;
Dame entendimiento conforme a tu palabra.
Llegue mi oración delante de ti;
Líbrame conforme a tu dicho.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mis labios rebosarán de tu loor', 'Mis labios rebosarán alabanza,
Cuando me enseñes tus estatutos.
Hablará mi lengua tus dichos,
Porque todos tus mandamientos son justicia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Socórreme, Señor, con tu diestra', 'Venga tu mano a socorrerme,
Porque tus mandamientos he escogido.
He deseado tu salvación, oh Jehová,
Y tu ley es mi delicia.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Viva mi alma y te alabe sin cesar', 'Viva mi alma y te alabe,
Y tus juicios me ayuden.
Yo anduve errante como oveja extraviada;
Busca a tu siervo, porque no me he olvidado de tus mandamientos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A Jehová clamé en mi tribulación', 'A Jehová clamé estando en angustia,
Y él me respondió.
Libra mi alma, oh Jehová, del labio mentiroso,
Y de la lengua fraudulenta.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levantaré mis ojos al Creador', 'Levantaré mis ojos a los montes,
¿De dónde vendrá mi ayuda?
Mi ayuda viene del Señor,
Creador del cielo y de la tierra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová guardará tu alma de todo mal', 'Jehová te guardará de todo mal;
Él guardará tu alma.
Jehová guardará tu salida y tu entrada
Desde ahora y para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Paz sea dentro de tus muros, Jerusalén', 'Pedid por la paz de Jerusalén;
Sean prosperados los que te aman.
Sea la paz dentro de tus muros,
Y el descanso dentro de tus palacios.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Nuestra alma escapó del cazador', 'Nuestra alma escapó cual ave
Del lazo de los cazadores;
Se rompió el lazo, y escapamos nosotros.
Nuestro socorro está en el nombre de Jehová,
Que hizo el cielo y la tierra.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grandes cosas ha hecho el Señor con nosotros', 'Grandes cosas ha hecho Jehová con nosotros,
Grandes cosas ha hecho el Señor.
Grandes cosas ha hecho Jehová con nosotros,
Por eso estamos alegres.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu pueblo se ofrecerá voluntario', 'Tu pueblo se ofrecerá voluntariamente
En el día de tu poder,
En la hermosura de la santidad.
Desde el seno de la aurora
Tienes tú el rocío de tu juventud.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Juró Jehová y no se arrepentirá jamás', 'Juró Jehová, y no se arrepentirá:
Tú eres sacerdote para siempre
Según el orden de Melquisedec.
El Señor está a tu diestra;
Quebrantará a los reyes en el día de su ira.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Del arroyo beberá en la batalla', 'Del arroyo beberá en el camino,
Por lo cual levantará la cabeza.
Alabaré a Jehová con todo el corazón
En la compañía y congregación de los rectos.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grandes y santas son las obras de Jehová', 'Grandes son las obras de Jehová,
Buscadas de todos los que las quieren.
Gloria y hermosura es su obra,
Y su justicia permanece para siempre.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ha hecho memorables sus obras de poder', 'Ha hecho memorables sus maravillas;
Clemente y misericordioso es Jehová.
Dio comida a los que le temen;
Para siempre se acordará de su pacto.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El temor de Jehová principio de sabiduría', 'El principio de la sabiduría es el temor de Jehová;
Buen entendimiento tienen todos los que practican sus mandamientos;
Su loor permanece para siempre.
¡Aleluya! ¡Alabad a Jehová!', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dichoso el hombre que teme al Señor', 'Bienaventurado el hombre que teme a Jehová,
Y en sus mandamientos se deleita en gran manera.
Su descendencia será poderosa en la tierra;
La generación de los rectos será bendita.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Luz resplandeciente en las tinieblas', 'Resplandeció en las tinieblas luz a los rectos;
Es clemente, misericordioso y justo.
El hombre de bien tiene misericordia, y presta;
Gobierna sus asuntos con juicio.', 1);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No tendrá temor su corazón confiado', 'No tendrá temor de malas noticias;
Su corazón está firme, asegurado en Jehová.
Asegurado está su corazón; no temerá,
Hasta que vea en sus enemigos su deseo.', 1);

-- Reconstrucción y sincronización del índice FTS5 para búsqueda espontánea
INSERT INTO choruses_fts(choruses_fts) VALUES('rebuild');
