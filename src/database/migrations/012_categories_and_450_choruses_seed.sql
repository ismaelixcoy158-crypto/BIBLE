-- Migration 012: Inserción de 9 Categorías Temáticas y 450 Coros Pentecostales
-- Organizados por temas (Felicidad, Júbilo, Espíritu Santo, Victoria, Gratitud, Adoración, Salvación, Iglesia, Cielo)

INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (3, 'Felicidad, Gozo y Alegría', '#F59E0B');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (4, 'Júbilo y Alabanza', '#10B981');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (5, 'Espíritu Santo y Avivamiento', '#EF4444');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (6, 'Victoria y Guerra Espiritual', '#8B5CF6');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (7, 'Gratitud y Bendición', '#06B6D4');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (8, 'Adoración y Presencia de Dios', '#3B82F6');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (9, 'Salvación y Testimonio', '#EC4899');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (10, 'Iglesia, Unidad y Servicio', '#14B8A6');
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (11, 'Cielo, Esperanza y Segunda Venida', '#F97316');

INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo tengo gozo en mi alma', 'Yo tengo gozo en mi alma,
Gozo en mi alma y en mi ser.
Es como ríos de agua viva,
Ríos de agua viva en mi ser.

Vamos cantando con todo su poder,
Vamos cantando con todo su poder.
Da gloria a Dios, da gloria a él,
Vamos cantando con todo su poder.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La alegría del Señor', 'La alegría del Señor mi fortaleza es,
La alegría del Señor mi fortaleza es.
Su gozo sin medida él me da,
Su gozo sin medida él me da.

Si tienes ese gozo puedes tú cantar,
Si tienes ese gozo puedes alabar.
La alegría del Señor mi fortaleza es,
Y su gozo para siempre durará.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay gozo, hay gozo', 'Hay gozo, hay gozo en mi corazón,
Porque Jesucristo me dio el perdón.
Hay gozo, hay gozo en mi corazón,
Tengo salvación y redención.

Canto con júbilo al Rey de gloria,
Canto con júbilo en su victoria.
Hay gozo, hay gozo en mi corazón,
Porque Jesucristo es mi Señor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo me da felicidad', 'Cristo me da felicidad,
Cristo me da la libertad.
En este mundo de dolor,
Tengo la paz de mi Señor.

Felicidad que nunca acabará,
Felicidad que el cielo me dará.
Cristo me da felicidad,
Por toda la eternidad.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gozo que tengo yo', 'El gozo que tengo yo,
El mundo no me lo dio.
El gozo que tengo yo,
El mundo no me lo dio.

Y como no me lo dio,
No me lo puede quitar.
Y como no me lo dio,
No me lo puede quitar.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Estoy alegre porque Cristo vive', 'Estoy alegre porque Cristo vive,
Estoy alegre porque él reina en mí.
La muerte y la tumba él venció,
Y vida eterna a mi alma dio.

¡Aleluya, gloria al Redentor!
¡Aleluya, vivo por su amor!
Estoy alegre porque Cristo vive,
Y para siempre cantaré su loor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tengo gozo en mi corazón', 'Tengo gozo en mi corazón,
Gozoso alabo al Salvador.
Quitó la carga del pecado,
Y de su gracia me ha colmado.

Canto con gozo, salto de alegría,
Cristo es la luz que guía mi vida.
Tengo gozo en mi corazón,
Gozoso alabo al Salvador.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué feliz soy con Cristo', 'Qué feliz soy con Cristo,
Qué feliz soy con mi Jesús.
Él disipó las sombras,
Y me alumbró con su santa luz.

Ya no vivo yo, Cristo vive en mí,
Desde aquel día en que le conocí.
Qué feliz soy con Cristo,
Caminando hacia el cielo voy.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La felicidad del cristiano', 'La felicidad del cristiano no es terrenal,
La felicidad del cristiano es celestial.
Viene del trono de la gracia,
Llena el alma de alabanza.

Aunque la prueba venga a golpear,
El gozo de Dios no se apagará.
La felicidad del cristiano es celestial,
Fuente inagotable de paz eternal.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay una fiesta en mi corazón', 'Hay una fiesta en mi corazón,
Desde que Cristo me rescató.
Puso un cántico de júbilo,
Y mi lamento en baile tornó.

Fiesta de gracia, fiesta de loor,
Celebrando la gloria del Señor.
Hay una fiesta en mi corazón,
Alabando a Cristo mi Salvador.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corazón está contento', 'Mi corazón está contento,
Mi corazón alegre está.
Porque Jesús con su poder,
Toda tristeza quitó ya.

Ahora canto aleluya,
Ahora salto de alegría.
Mi corazón está contento,
En la presencia de Jehová.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gozo de mi salvación', 'Vuélveme el gozo de mi salvación,
Y espíritu noble me sustente.
Límpiame, oh Dios, de todo error,
Y te alabaré continuamente.

Mi alma se goza en tu perdón,
Mi boca proclama tu bondad.
El gozo de mi salvación,
Me llena de gozo y de verdad.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alegre estoy, alegre estoy', 'Alegre estoy, alegre estoy,
Porque al cielo con Cristo voy.
Alegre estoy, alegre estoy,
Porque redimido por su sangre soy.

No temeré lo que venga aquí,
Su diestra me guarda a mí.
Alegre estoy, alegre estoy,
Porque al cielo con Cristo voy.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es mi alegría', 'Cristo es mi alegría,
De noche y de día.
En la tribulación él es mi sostén,
En la soledad él es mi fiel bien.

Cantaré de su dulce paz,
Buscaré siempre más su faz.
Cristo es mi alegría,
De noche y de día.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tengo una vida feliz', 'Tengo una vida feliz con mi Jesús,
Caminando en sendas de justicia y luz.
Su amor me protege, su mano me guía,
Llenando mi alma de santa armonía.

Vida abundante él me prometió,
Vida eterna su gracia me dio.
Tengo una vida feliz con mi Jesús,
Llevando con gozo mi bendita cruz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gozo, gozo, gozo', 'Gozo, gozo, gozo en mi corazón,
Paz inagotable que me da el Señor.
Ríos de bendición fluyendo están,
Las aguas del cielo satisfarán.

Alabanza en mi boca brotará,
El enemigo confundido huirá.
Gozo, gozo, gozo en mi corazón,
Cantando victorias a mi Salvador.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La alegría de servir a Cristo', 'La alegría de servir a Cristo,
No se compara con nada aquí.
Llevar su palabra a las naciones,
Es el privilegio más feliz.

Obrero de fe, testigo de amor,
Sembrando la gracia del Salvador.
La alegría de servir a Cristo,
Corona de gloria nos dará al fin.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma canta de alegría', 'Mi alma canta de alegría,
Porque el Señor ha sido fiel.
Quitó las cadenas de mi prisión,
Y puso un cántico en mi corazón.

Cantaré salmos al Dios Altísimo,
Exaltaré su nombre bendito.
Mi alma canta de alegría,
Porque el Señor ha sido fiel.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué bonito es alabar a Dios', 'Qué bonito es alabar a Dios,
Con las manos, con los pies y con la voz.
Qué bonito es sentir el poder,
Del Espíritu Santo que llena mi ser.

Ven y alábale tú también,
Recibe la gloria que viene del Rey.
Qué bonito es alabar a Dios,
Dando gracias por su infinito amor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hoy estoy muy feliz', 'Hoy estoy muy feliz,
Porque Cristo vive en mí.
Hoy estoy muy feliz,
Su perdón yo recibí.

Las penas de ayer quedaron atrás,
Con Jesús tengo victoria y paz.
Hoy estoy muy feliz,
Porque Cristo vive en mí.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gozo del Espíritu Santo', 'El gozo del Espíritu Santo
Desciende sobre mi ser.
Ríos de agua viva fluyen,
Llenándome de poder.

Fuego que quema la frialdad,
Luz que disipa la oscuridad.
El gozo del Espíritu Santo
Me llena de santidad.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay gozo en la casa de Dios', 'Hay gozo en la casa de Dios,
Hay fiesta en la congregación.
Unánimes juntos en oración,
Recibiendo la bendición.

El cojo salta, el ciego ve,
Los santos alaban con gran fe.
Hay gozo en la casa de Dios,
Glorificando al Salvador.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy feliz con Jesús', 'Soy feliz con Jesús,
Él es mi Salvador.
Soy feliz con Jesús,
Me llena de su amor.

En la tormenta tengo su calma,
En la tristeza consuela mi alma.
Soy feliz con Jesús,
Caminando hacia la luz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi vida está llena de gozo', 'Mi vida está llena de gozo,
Mi vida está llena de paz.
Desde que Cristo vino a morar,
Nunca más he vuelto a llorar.

Manantiales de vida eterna,
Brotan en mi corazón.
Mi vida está llena de gozo,
Dando a Cristo adoración.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantando con alegría', 'Cantando con alegría,
A Dios alabaré.
Por todas sus maravillas,
Mi vida rendiré.

Con pandero, guitarra y voz,
Exaltaré al gran Dios.
Cantando con alegría,
A Dios alabaré.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La felicidad está en Cristo', 'La felicidad no está en el dinero,
Ni en placeres que pronto se van.
La felicidad está en Cristo Jesús,
Que murió en la cruz para darte luz.

Búscale hoy de todo corazón,
Y recibirás la salvación.
La felicidad está en Cristo Jesús,
Fuente de vida y eterno perdón.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tengo una sonrisa', 'Tengo una sonrisa en mi rostro,
Porque Cristo cambió mi vivir.
El llanto que antes tenía,
En gozo lo hizo fluir.

Sonrío porque él me ama,
Sonrío porque él me sana.
Tengo una sonrisa en mi rostro,
Porque Cristo cambió mi vivir.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alegre voy caminando', 'Alegre voy caminando,
Por la senda de la verdad.
La mano de Dios me sostiene,
Con su gracia y su bondad.

No temeré los tropiezos,
Jesús va adelante de mí.
Alegre voy caminando,
Hasta la patria feliz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo alegra mi vida', 'Cristo alegra mi vida,
En la mañana y al atardecer.
Su presencia bendita,
Renueva todo mi ser.

No hay gozo en este mundo,
Como el gozo de su poder.
Cristo alegra mi vida,
Y le alabo con placer.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corazón se goza', 'Mi corazón se goza en Jehová,
Mi poder se exalta en mi Dios.
Mi boca se ensanchó sobre mis enemigos,
Por cuanto me alegré en tu salvación.

No hay santo como Jehová,
Porque no hay ninguno fuera de ti.
Mi corazón se goza en Jehová,
Y para siempre le exaltaré a él.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay fiesta en el cielo', 'Hay fiesta en el cielo,
Cuando un pecador se arrepiente.
Los ángeles cantan alabanzas,
Al Padre Omnipotente.

Bienvenido a la casa de Dios,
Hijo pródigo que regresó.
Hay fiesta en el cielo,
Demos gloria al Redentor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gozo en mi corazón', 'Gozo en mi corazón siento brotar,
Gozo que nadie me puede robar.
Es el Espíritu de santidad,
Llenándome de verdad.

Canto con voz de gratitud,
Celebrando su virtud.
Gozo en mi corazón siento brotar,
Por la eternidad he de cantar.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué alegría es ser cristiano', 'Qué alegría es ser cristiano,
Llevar a Cristo en el corazón.
Tener la promesa del cielo,
Y la corona de salvación.

Hermano, no desmayes jamás,
Que con Cristo la victoria tendrás.
Qué alegría es ser cristiano,
Heredero de gloria y paz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me gozo en el Señor', 'Me gozo en el Señor,
Mi alma en él descansa.
Me viste de alegría,
Y pone en mí esperanza.

Aunque la higuera no florezca,
En Jehová me alegraré.
Me gozo en el Señor,
Y su nombre ensalzaré.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma está gozosa', 'Mi alma está gozosa en mi Creador,
Él ha sido mi escudo y defensor.
Bajo sus alas seguras estoy,
Hacia la santa morada voy.

Alégrense los justos en el Rey,
Canten con júbilo toda su grey.
Mi alma está gozosa en mi Creador,
Dando gracias por su favor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabemos con alegría', 'Alabemos con alegría,
Al Señor de la creación.
Canten los cielos y la tierra,
Con gran regocijo y loor.

Batid las manos, pueblos todos,
Aclamad a Dios con honor.
Alabemos con alegría,
Al Señor de la creación.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy dichoso con Jesús', 'Soy dichoso con Jesús,
Mi buen Pastor y Guía.
En verdes prados me apacienta,
Y colma mi alma de alegría.

Nada me faltará en su grey,
Confío en la palabra del Rey.
Soy dichoso con Jesús,
Caminando hacia la luz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La vida con Cristo es hermosa', 'La vida con Cristo es hermosa,
Llena de gracia y de paz.
Las cargas pesadas del mundo,
A sus pies las puedes dejar.

Ven a Jesús pecador,
Recibe hoy su amor.
La vida con Cristo es hermosa,
Es un gozo que no morirá.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor me ha dado gozo', 'El Señor me ha dado gozo,
El Señor me ha dado paz.
Quitó mi vestido de luto,
Y me ciñó de bondad.

Por tanto a ti cantaré,
Gloria mía, y no callaré.
El Señor me ha dado gozo,
Por los siglos te alabaré.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hoy mi corazón canta', 'Hoy mi corazón canta,
Una melodía al Señor.
Agradecido por su gracia,
Y su infinito amor.

Él transformó mi tristeza,
En cánticos de loor.
Hoy mi corazón canta,
Una melodía al Señor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Que viva Cristo', 'Que viva Cristo, que viva el Rey,
Que viva en medio de su grey.
Que viva Cristo de Nazaret,
Que sacia de su agua nuestra sed.

¡Viva Cristo, viva el Señor!
¡Viva por siempre el Salvador!
Que viva Cristo, que viva el Rey,
Alabémosle con gran fe.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi gozo nadie me lo quita', 'Mi gozo nadie me lo quita,
Porque en Cristo seguro está.
Ni la aflicción ni la tormenta,
Mi cántico apagarán.

Firme está mi confianza en él,
Mi Dios es poderoso y fiel.
Mi gozo nadie me lo quita,
Porque en Cristo seguro está.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con alegría cantaré', 'Con alegría cantaré a mi Dios,
Alzaré en su templo la voz.
Publicaré sus hechos de poder,
Y su nombre bendeciré.

Grande es Jehová y digno de honor,
Eterno es su tierno amor.
Con alegría cantaré a mi Dios,
Alzaré en su templo la voz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gozo de Jehová es mi fuerza', 'No estéis tristes ni temáis,
Que el gozo de Jehová es vuestra fuerza.
Bebed el agua de su perdón,
Y comed el pan de la bendición.

Su presencia nos renueva hoy,
A su nombre gloria y honra doy.
El gozo de Jehová es mi fuerza,
Para vencer con gran poder.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tengo paz y alegría', 'Tengo paz y alegría en mi Jesús,
Desde que por fe vi su cruz.
Mi pecado borró en el madero,
Y me vistió de lino verdadero.

Paz que sobrepasa el entender,
Gozo que inunda todo mi ser.
Tengo paz y alegría en mi Jesús,
Caminando en sendas de luz.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús es mi felicidad', 'Jesús es mi felicidad,
Mi roca y mi refugio eternal.
En medio de la tempestad,
Su diestra me libra del mal.

No cambiaré su dulce compañía,
Por nada de este mundo terrenal.
Jesús es mi felicidad,
Mi tesoro celestial.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma se alegra en Dios', 'Mi alma se alegra en Dios mi Salvador,
Porque ha mirado mi humilde corazón.
Grandes cosas ha hecho el Poderoso,
Y santo es su glorioso nombre.

Su misericordia de siglo en siglo está,
Sobre aquellos que le temen con verdad.
Mi alma se alegra en Dios mi Salvador,
Y le rindo perpetuo loor.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay alegría en mi ser', 'Hay alegría en mi ser,
Ríos de bendición.
La gracia de Dios me alcanzó,
Y me colmó de salvación.

Canto con gozo al Señor,
Digno de honra y loor.
Hay alegría en mi ser,
Ríos de bendición.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Celebremos al Señor', 'Celebremos al Señor con cánticos,
Celebremos al Señor con júbilo.
Porque él resucitó victorioso,
Y reina por los siglos glorioso.

Vamos todos a celebrar,
Su nombre santo a proclamar.
Celebremos al Señor con cánticos,
Al Cordero que venció.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con Cristo soy feliz', 'Con Cristo soy feliz,
Él cuida de mi ser.
En la prueba y el dolor,
Me da de su poder.

No temeré lo que vendrá,
Mi Dios conmigo está.
Con Cristo soy feliz,
Por toda la eternidad.', 3);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabaré a Jehová', 'Alabaré a Jehová con todo mi corazón,
En la congregación de los rectos y en la reunión.
Grandes son las obras de Jehová,
Buscadas de todos los que las quieren.

Gloria y hermosura es su obra,
Y su justicia permanece para siempre.
Alabaré a Jehová con todo mi corazón,
¡Aleluya al Dios de mi salvación!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bueno es alabar al Señor', 'Bueno es alabarte, Señor,
Y cantar salmos a tu nombre, oh Altísimo.
De mañana anunciar tu misericordia,
Y tu verdad en cada noche.

Con instrumentos de diez cuerdas y salterio,
En tono solemne con el arpa.
Bueno es alabarte, Señor,
Por tus grandes maravillas.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantemos al Señor', 'Cantemos al Señor un cántico nuevo,
Porque ha hecho grandes maravillas.
Su diestra y su santo brazo,
Nos han dado la victoria.

Aclamad a Jehová, toda la tierra,
Levantad la voz y cantad salmos.
Cantemos al Señor un cántico nuevo,
¡Aleluya a nuestro Dios!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo celebraré', 'Yo celebraré, cantaré al Señor,
Cantaré un nuevo cántico.
Yo celebraré, cantaré al Señor,
Cantaré un nuevo cántico.

Alabaré a Jehová,
Porque él ha triunfado con gloria.
Alabaré a Jehová,
Porque él ha triunfado con gloria.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grande es Jehová', 'Grande es Jehová, y digno de ser alabado,
En la ciudad de nuestro Dios, en su monte santo.
Hermosa provincia, el gozo de toda la tierra,
Es el monte de Sion, la ciudad del gran Rey.

Dios en sus palacios es conocido por refugio,
Grande es Jehová por los siglos de los siglos.
Grande es Jehová, y digno de ser alabado,
¡Alabado sea el Señor!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendeciré al Señor', 'Bendeciré al Señor en todo tiempo,
Su alabanza de continuo en mi boca estará.
En Jehová se gloriará mi alma,
Lo oirán los mansos y se alegrarán.

Engrandeced a Jehová conmigo,
Y exaltemos a una su nombre.
Bendeciré al Señor en todo tiempo,
Él es digno de todo loor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Todo lo que respira alabe', 'Alabad a Dios en su santuario,
Alabadle en la magnificencia de su firmamento.
Alabadle por sus proezas,
Alabadle conforme a su grandeza.

Alabadle con címbalos de júbilo,
Alabadle con pandero y danza.
Todo lo que respira alabe a Jehová,
¡Aleluya, amén!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levanta tus manos', 'Levanta tus manos al cielo,
Y adora al Rey de gloria.
Abre tu corazón con fervor,
Y recibe la victoria.

Él habita en la alabanza de su pueblo,
Derramando su unción y su poder.
Levanta tus manos al cielo,
Y glorifícale con todo tu ser.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Vamos a alabar a Dios', 'Vamos a alabar a Dios,
Con pandero y con trompeta.
Vamos a alabar a Dios,
Que su gloria está completa.

Que se goce todo su pueblo,
Que se alegre la congregación.
Vamos a alabar a Dios,
De todo corazón.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabaré con todo mi corazón', 'Alabaré a Dios con todo mi corazón,
Delante de los reyes le cantaré.
Me postraré hacia su santo templo,
Y alabaré su nombre para siempre.

Por su misericordia y su fidelidad,
Porque ha engrandecido su santa verdad.
Alabaré a Dios con todo mi corazón,
Con cánticos de devoción.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gloria a Dios', '¡Gloria a Dios en las alturas,
Y en la tierra paz!
Buena voluntad para los hombres,
Que buscan su santa faz.

Digno es el Cordero inmolado,
De recibir el imperio y poder.
¡Gloria a Dios en las alturas,
Por siempre sea su loor!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Santo, santo, santo', 'Santo, Santo, Santo, Señor Omnipotente,
El mundo y las estrellas proclaman tu loor.
Santo, Santo, Santo, te adora el creyente,
Dios en tres Personas, bendito Redentor.

Los ángeles del cielo postrados a tus pies,
Rinden coronas de gloria y honor.
Santo, Santo, Santo, Señor Omnipotente,
Por siempre reinarás con resplandor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Dios es grande', 'Mi Dios es grande, mi Dios es fuerte,
Nadie en la tierra le vencerá.
Él hizo el cielo, la mar y la tierra,
Y con su mano me sostendrá.

Poderoso en batalla, Príncipe de paz,
Su gloria en nuestras vidas brillará.
Mi Dios es grande, mi Dios es fuerte,
¡Aleluya por la eternidad!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantad alegres a Dios', 'Cantad alegres a Dios, habitantes de toda la tierra,
Servid a Jehová con alegría.
Venid ante su presencia con regocijo,
Reconoced que Jehová es Dios.

Él nos hizo, y no nosotros a nosotros mismos;
Pueblo suyo somos, y ovejas de su prado.
Cantad alegres a Dios, habitantes de toda la tierra,
Porque para siempre es su bondad.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Exaltado sea Jehová', 'Exaltado sea Jehová en las alturas,
Porque ha hecho cosas magníficas.
Sea sabido esto en toda la tierra,
Grita y da voces, oh moradora de Sion.

Porque grande es en medio de ti el Santo de Israel,
Su majestad llena el firmamento.
Exaltado sea Jehová en las alturas,
A él sea la gloria y el imperio.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Demos gloria al Rey', 'Demos gloria al Rey de reyes,
Demos honra al Salvador.
Pueblos todos, aclamadle,
Con cánticos de amor.

Él venció las tinieblas con su poder,
Y nos dio una vida nueva al nacer.
Demos gloria al Rey de reyes,
Por los siglos de los siglos, amén.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A Cristo cantaré', 'A Cristo cantaré mientras yo viva,
A mi Dios cantaré salmos mientras tenga ser.
Dulce será mi alabanza en su presencia,
Y en Jehová siempre me gozaré.

Líbrame, Señor, del camino malo,
Y guíame por sendas de rectitud.
A Cristo cantaré mientras yo viva,
Lleno de fe y gratitud.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabanzas al Rey', 'Alabanzas al Rey que vive,
Alabanzas al Dios de Abraham.
Al que reina con cetro de justicia,
Y las naciones adorarán.

Canten coros celestiales,
Únanse las voces del pueblo fiel.
Alabanzas al Rey que vive,
¡Santo es el Señor Emanuel!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con palmas y alegría', 'Con palmas y alegría,
Celebramos al Señor.
Con danzas de victoria,
Alabamos su amor.

El Señor marchando va,
Y su pueblo vencerá.
Con palmas y alegría,
Celebramos al Señor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi boca te alabará', 'Mi boca te alabará con labios de júbilo,
Cuando me acuerde de ti en mi lecho.
Porque has sido mi pronto socorro,
Bajo la sombra de tus alas me gozaré.

Está mi alma apegada a ti,
Tu diestra me ha sostenido con poder.
Mi boca te alabará con labios de júbilo,
Y mi vida te bendecirá.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es digno', 'Cristo es digno de recibir la gloria,
Cristo es digno de recibir honor.
Porque fue inmolado en el Calvario,
Y con su sangre nos redimió.

Toda rodilla se doblará,
Y toda lengua confesará:
Cristo es digno de recibir la gloria,
Rey de reyes y eterno Señor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay poder en la alabanza', 'Hay poder en la alabanza a Dios,
Los muros de opresión se caerán.
Cadenas de aflicción se rompen hoy,
Cuando los redimidos cantan.

Alaba con fe, alaba sin cesar,
Que la gloria del cielo descenderá.
Hay poder en la alabanza a Dios,
Para libertar y sanar.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levántate y alaba', 'Levántate y alaba al Señor tu Dios,
No te quedes en silencio hoy.
Que la gloria de Jehová ha nacido sobre ti,
Y su luz disipa la oscuridad.

Alza tu voz como trompeta,
Declara que Cristo vive en ti.
Levántate y alaba al Señor tu Dios,
Con todo tu corazón.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantemos gloria', 'Cantemos gloria, gloria al Señor,
Cantemos gloria al Salvador.
Él nos lavó de todo pecado,
Y a su reino nos ha trasladado.

A una sola voz celebremos,
Al Dios viviente exaltemos.
Cantemos gloria, gloria al Señor,
Por su incomparable amor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aplaudid al Señor', 'Pueblos todos, aplaudid al Señor,
Aclamad a Dios con voz de júbilo.
Porque Jehová el Altísimo es temible,
Rey grande sobre toda la tierra.

Él someterá los pueblos debajo de nosotros,
Y las naciones debajo de nuestros pies.
Pueblos todos, aplaudid al Señor,
Canten con inteligencia y loor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabaré su nombre', 'Alabaré su nombre con cántico de júbilo,
Le exaltaré con cánticos de loor.
Y agradará a Jehová más que sacrificio,
Verán los humildes y se alegrarán.

Buscad a Dios y vivirá vuestro corazón,
Porque Jehová oye a los menesterosos.
Alabaré su nombre con cántico de júbilo,
Y le adoraré con amor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor es digno', 'El Señor es digno de suprema alabanza,
En los cielos y en la tierra por igual.
Su nombre es refugio y esperanza,
Su reino no tendrá final.

Alégrense los campos y lo que en ellos hay,
Los árboles del bosque cantarán delante de Jehová.
El Señor es digno de suprema alabanza,
¡Aleluya al Dios de la verdad!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gloria, gloria, aleluya', 'Gloria, gloria, aleluya,
Gloria, gloria al Salvador.
Gloria, gloria, aleluya,
Cristo es el vencedor.

En la cruz pagó mi deuda,
Y me dio la salvación.
Gloria, gloria, aleluya,
De todo corazón.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendito sea Dios', 'Bendito sea Dios, que no desechó mi oración,
Ni apartó de mí su misericordia.
Él oyó la voz de mi súplica,
Y puso mis pies sobre peña.

A él clamé con mi boca,
Y fue ensalzado con mi lengua.
Bendito sea Dios, que no desechó mi oración,
Y me llenó de su presencia.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Toda la tierra te alabará', 'Toda la tierra te adorará, oh Dios,
Y cantará a tu santo nombre.
Venid y ved las obras de Jehová,
Temible en hechos sobre los hijos de los hombres.

Él convirtió el mar en seco,
Por el río pasaron a pie; allí nos alegramos.
Toda la tierra te adorará, oh Dios,
Por los siglos de los siglos, amén.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al Rey de reyes', 'Al Rey de reyes y Señor de señores,
Sea la alabanza y la adoración.
Al que reina en justicia y poder,
Rindamos hoy el corazón.

Corona de gloria lleva en su sien,
Los ejércitos del cielo le siguen también.
Al Rey de reyes y Señor de señores,
Toda honra y exaltación.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma te alaba', 'Mi alma te alaba, oh Dios viviente,
Porque has sido mi escudo y fortaleza.
En medio de la prueba me diste paz,
Y saciaste mi alma de tu belleza.

No callaré tus maravillas,
Proclamaré tu grande poder.
Mi alma te alaba, oh Dios viviente,
Con todo mi humilde ser.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo cantaré a Jehová', 'Cantaré a Jehová por siempre,
Su diestra es todo poder.
Echó en el mar al jinete y al caballo,
Y a su pueblo hizo vencer.

Jehová es mi fortaleza y mi cántico,
Y ha sido mi salvación.
Yo cantaré a Jehová por siempre,
Con júbilo y adoración.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Exaltemos su nombre', 'Exaltemos su nombre a una,
Engrandezcamos al Creador.
Que resuene en todo el santuario,
La gloria de nuestro Señor.

Él perdona nuestras iniquidades,
Y sana nuestras dolencias con amor.
Exaltemos su nombre a una,
Digno de eterna adoración.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Digno eres tú', 'Digno eres tú de tomar el libro,
Y de abrir sus sellos santos.
Porque fuiste inmolado con amor,
Y con tu sangre nos has redimido.

De todo linaje, lengua, pueblo y nación,
Nos has hecho reyes y sacerdotes para Dios.
Digno eres tú, oh Cordero santo,
De gloria, poder y loor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantando voy', 'Cantando voy por el camino estrecho,
Con Jesús mi dulce Salvador.
Aunque la senda sea pedregosa,
Me sostiene su mano de amor.

Ya veo las torres de la santa Sion,
Donde tendré eterna mansión.
Cantando voy por el camino estrecho,
Lleno de paz y devoción.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabanzas de victoria', 'Alabanzas de victoria entonemos,
Al que triunfó sobre el pecado y la muerte.
Cristo rompió las puertas del sepulcro,
Y reina por los siglos fuerte.

¡Aleluya, resucitó el Salvador!
¡Aleluya, ya no hay condenación!
Alabanzas de victoria entonemos,
Con todo nuestro corazón.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es mi fortaleza', 'Jehová es mi fortaleza y mi escudo,
En él confió mi corazón y fui ayudado.
Por lo que se gozó mi ser,
Y con mi cántico le alabaré.

Jehová es la fuerza de su pueblo,
Y el refugio salvador de su ungido.
Jehová es mi fortaleza y mi escudo,
Para siempre bendito sea él.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabemos al Creador', 'Alabemos al Creador de los cielos,
Al que formó las estrellas y el mar.
Al que sostiene con su mano el universo,
Y nos llama a su presencia a adorar.

Grande es su nombre en toda la tierra,
Infinita su gloria y su majestad.
Alabemos al Creador de los cielos,
Con reverencia y lealtad.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Que toda lengua confiese', 'Que toda lengua confiese a Jesús,
Que toda rodilla se doble ante él.
En los cielos, en la tierra y debajo,
Porque él es el Santo Emanuel.

Jesucristo es el Señor para la gloria del Padre,
Exaltado hasta lo sumo en el trono celestial.
Que toda lengua confiese a Jesús,
Rey soberano e inmortal.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grande y maravilloso', 'Grandes y maravillosas son tus obras,
Señor Dios Todopoderoso.
Justos y verdaderos son tus caminos,
Rey de los santos.

¿Quién no te temerá, oh Señor,
Y glorificará tu nombre?
Porque solo tú eres santo,
Y todas las naciones te adorarán.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A ti sea la gloria', 'A ti sea la gloria, a ti sea el honor,
A ti sea la fuerza y el loor.
Tuyo es el reino, tuyo el poder,
Por los siglos de los siglos, amén.

Bendito el Dios de nuestra salvación,
Que colma su iglesia de bendición.
A ti sea la gloria, a ti sea el honor,
Jesucristo Redentor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Dios es poderoso', 'Mi Dios es poderoso para librar,
En medio del fuego y en medio del mar.
No hay gigante que se pueda parar,
Delante de su mano celestial.

Él abre puertas que nadie cerrará,
Y su promesa firme estará.
Mi Dios es poderoso para librar,
¡Alabemos a Jehová!', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantemos aleluya', 'Cantemos aleluya al Dios de amor,
Cantemos aleluya al buen Pastor.
Rindamos honra, prez y majestad,
Al que nos guía en santidad.

¡Aleluya, aleluya, aleluya al Rey!
¡Aleluya, aleluya, canta su grey!
Cantemos aleluya al Dios de amor,
Por siempre nuestro Salvador.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gloria al nombre de Jesús', 'Gloria al nombre de Jesús,
Nombre sobre todo nombre es.
En su nombre hay poder y salvación,
En su nombre hay consuelo y perdón.

Alabemos el nombre glorioso de Cristo,
Que en la cruz venció con su cruz.
Gloria al nombre de Jesús,
Por la eternidad amén.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Alabanzas en mi boca', 'Alabanzas en mi boca siempre habrá,
Porque Dios ha sido bueno y leal.
De día y de noche le ensalzaré,
Y en su palabra me deleitaré.

No callarán mis labios su verdad,
Proclamaré su eterna fidelidad.
Alabanzas en mi boca siempre habrá,
Para el gran Dios de amor.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El nombre de Jesús', 'El nombre de Jesús es torre fuerte,
A él correrá el justo y levantado será.
No hay demonio que resista su poder,
Ante su nombre el infierno huirá.

Precioso nombre de paz y victoria,
Lleno de gracia, perfume y gloria.
El nombre de Jesús es torre fuerte,
Mi refugio eternal.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te exaltaré', 'Te exaltaré, mi Dios, mi Rey,
Y bendeciré tu nombre eternamente y para siempre.
Cada día te bendeciré,
Y alabaré tu nombre por los siglos.

Grande es Jehová y digno de alabar,
Y su grandeza es inescrutable.
Te exaltaré, mi Dios, mi Rey,
Con cánticos de fe.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Adoremos al Señor', 'Adoremos al Señor en la hermosura de su santidad,
Temblad delante de él, toda la tierra.
Decid entre las naciones: Jehová reina,
Y juzgará a los pueblos con equidad.

Alégrense los cielos y gócese la tierra,
Bramen los mares y su plenitud.
Adoremos al Señor en la hermosura de su santidad,
Llenos de virtud.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aleluya, Cristo vive', '¡Aleluya, Cristo vive!
¡Aleluya, resucitó!
La tumba vacía quedó,
Y la muerte él venció.

Reina sentado a la diestra del Padre,
Intercediendo por su grey.
¡Aleluya, Cristo vive!
Gloria eterna a nuestro Rey.', 4);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Espíritu Santo ven', 'Espíritu Santo ven, toma el control,
Llena este templo con tu resplandor.
Ven con poder, fuego y unción,
Aviva hoy a cada corazón.

Queremos sentir tu santa presencia,
Rindiendo las almas con reverencia.
Espíritu Santo ven, toma el control,
Manifiéstate, Consolador.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Manda fuego, Señor', 'Manda fuego, Señor, manda fuego,
Manda fuego de tu poder.
Que descienda del cielo la llama,
Que me llene de gracia y saber.

Fuego que quema el pecado,
Fuego que rompe el dolor.
Manda fuego, Señor, manda fuego,
Sobre tu pueblo, Señor.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay fuego en mi corazón', 'Hay fuego en mi corazón,
Fuego de Dios celestial.
Nadie lo puede apagar,
Porque es un fuego eternal.

Arde la zarza y no se consume,
La gloria de Dios a su iglesia unge.
Hay fuego en mi corazón,
Fuego de Dios celestial.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bautízame con tu Espíritu', 'Bautízame, Señor, con tu Espíritu Santo,
Bautízame, Señor, con fuego de lo alto.
Quiero hablar en nuevas lenguas de poder,
Y ver maravillas en mi ser.

Desciende como en el día de Pentecostés,
Lléname hoy otra vez.
Bautízame, Señor, con tu Espíritu Santo,
Te lo pido con amor.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fuego del altar', 'Fuego del altar, ven y quémame,
Purifica hoy mi vida otra vez.
Toma la brasa del trono de Dios,
Y pon en mis labios tu santa voz.

Heme aquí, Señor, envíame a mí,
Por tus caminos yo quiero seguir.
Fuego del altar, ven y quémame,
Límpiame con tu poder.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Desciende Espíritu Santo', 'Desciende, Espíritu Santo, desciende,
Como lluvia temprana y tardía.
Riega la tierra sedienta de mi alma,
Y tráenos gozo y alegría.

Que caiga tu unción aquí,
Que todos podamos sentir.
Desciende, Espíritu Santo, desciende,
Llénanos de tu poder.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Llena mi vida', 'Llena mi vida, Señor, con tu gracia,
Llena mi cántaro con agua viva.
Ya no quiero estar vacío jamás,
Dame de tu dulce y bendita paz.

Fluye en mí como río incesante,
Sé mi refugio en todo instante.
Llena mi vida, Señor, con tu gracia,
Te alabo de corazón.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aviva tu obra', 'Oh Jehová, he oído tu palabra y temí;
Aviva tu obra en medio de los tiempos.
En medio de los años hazla conocer;
En la ira acuérdate de la misericordia.

Levanta a tu iglesia con celo santo,
Que en todo lugar resuene el canto.
Aviva tu obra en medio de los tiempos,
Con gloria y salvación.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sopla Espíritu de Dios', 'Sopla, Espíritu de Dios, sobre este lugar,
Trae aliento de vida a nuestro altar.
De los cuatro vientos ven a soplar,
Huesos secos hoy vivirán.

Un ejército grande se levantará,
La gloria de Cristo brillará.
Sopla, Espíritu de Dios, sobre este lugar,
Con viento pentecostal.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Como en Pentecostés', 'Como en Pentecostés estaban orando,
Unánimes juntos la promesa esperando.
Vino un estruendo como viento recio,
Y lenguas de fuego sobre ellos cayeron.

Llénanos hoy como en aquel día,
Danos valor, poder y alegría.
Como en Pentecostés estaban orando,
Tu Espíritu está bajando.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ven, Espíritu Santo', 'Ven, Espíritu Santo, consolador divino,
Sé la lumbrera de mi camino.
Enseña a mi alma la santa verdad,
Guíame siempre en fidelidad.

Dulce huésped del corazón,
Dador de toda bendición.
Ven, Espíritu Santo, consolador divino,
Mora en mi ser Señor.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Enciende el fuego', 'Enciende el fuego en mi corazón,
No dejes que se apague la devoción.
Pon leña fresca en el altar,
Que la llama nunca deje de brillar.

De día y de noche encendido estará,
El fuego sagrado de Jehová.
Enciende el fuego en mi corazón,
Lleno de adoración.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero más de tu presencia', 'Quiero más de tu presencia, Señor,
Quiero más de tu santo amor.
Menos de mí y más de ti,
Es el anhelo con que vengo aquí.

Satúrame con tu bendito poder,
Hasta que rebose todo mi ser.
Quiero más de tu presencia, Señor,
Mi fiel Consolador.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay poder en el Espíritu', 'Hay poder en el Espíritu de Dios,
Para romper toda cadena de opresión.
Los ciegos ven, los mudos dan loor,
Por la virtud del gran Salvador.

No es con espada, no es con ejército,
Sino con su Santo Espíritu.
Hay poder en el Espíritu de Dios,
Alabemos con santa voz.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Espíritu Santo lléname', 'Espíritu Santo, lléname,
De tu santa gracia y de tu fe.
Que mi vaso se llene de tu unción,
Para servirte en consagración.

Toca mis manos, toca mis pies,
Aviva mi alma otra vez.
Espíritu Santo, lléname,
Por siempre te seguiré.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fuego pentecostal', 'Fuego, fuego, fuego pentecostal,
Fuego que sana, fuego que limpia el mal.
Fuego que quema la frialdad,
Y nos llena de gozo y santidad.

Desciende hoy en esta reunión,
Y danos a todos la bendición.
Fuego, fuego, fuego pentecostal,
Poder sobrenatural.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una lluvia de bendición', 'Una lluvia de bendición caerá,
Ríos de vida el Señor enviará.
Gotas de gracia ya sentimos aquí,
Mas la gran lluvia esperamos al fin.

Lluvia de avivamiento y poder,
Que renueva y sacia todo mi ser.
Una lluvia de bendición caerá,
El desierto florecerá.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Desciende tu gloria', 'Desciende tu gloria, Señor, como nube,
Que llena este templo y el monte sube.
Como en el templo del rey Salomón,
Donde los sacerdotes caían en postración.

No pudieron estar en pie para ministrar,
Por causa de la gloria en aquel lugar.
Desciende tu gloria, Señor, como nube,
Tu majestad nos inunde.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Derrama tu poder', 'Derrama tu poder sobre la congregación,
Que los jóvenes profeticen con unción.
Que los ancianos sueñen sueños de paz,
Y tus siervos proclamen tu faz.

En estos postreros días, Señor,
Cumple la promesa de tu amor.
Derrama tu poder sobre la congregación,
Con fuego y liberación.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Avivamiento en mi alma', 'Avivamiento en mi alma siento nacer,
Una llama viva de gracia y poder.
Ya no estoy frío ni tibio jamás,
El fuego de Cristo me alumbra más.

Arde mi espíritu en devoción,
Cantando victorias de redención.
Avivamiento en mi alma siento nacer,
Alabado sea su ser.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero sentir tu presencia', 'Quiero sentir tu presencia pasar,
Como viento suave en mi caminar.
Quiero escuchar tu voz celestial,
Que calma las olas de todo mal.

Acércate, Cristo, a mi corazón,
Y llena mi vida de adoración.
Quiero sentir tu presencia pasar,
Y para siempre en ti morar.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El fuego no se apagará', 'El fuego arderá continuamente en el altar,
No se apagará, no se apagará.
El sacerdote pondrá leña en él,
Cada mañana con corazón fiel.

Fuego de Dios en mi vida arderá,
Ninguna tormenta lo apagará.
El fuego arderá continuamente en el altar,
Hasta que Cristo venga a reinar.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Como lenguas de fuego', 'Como lenguas repartidas de fuego cayó,
El Espíritu Santo que Dios prometió.
Y hablaron en lenguas según el poder,
Que el Santo Espíritu les daba al nacer.

Hoy también sentimos esa santa unción,
Que transforma y bautiza la congregación.
Como lenguas repartidas de fuego cayó,
¡Gloria al Señor que nos visitó!', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sopla sobre mí', 'Sopla sobre mí, Espíritu de Dios,
Hazme temblar al oír tu voz.
Lléname de gozo, de paz y verdad,
Guíame en sendas de santidad.

Que tu unción fresca descienda en mí,
Para consagrar mi vida a ti.
Sopla sobre mí, Espíritu de Dios,
Rindo mi ser a tu voz.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Llena este lugar', 'Llena este lugar con tu gloria, Señor,
Llena este altar con tu dulce calor.
Que cada hermano sienta tu poder,
Y los afligidos vuelvan a creer.

Abre los cielos y manda tu unción,
Sana las almas, derrama perdón.
Llena este lugar con tu gloria, Señor,
A ti sea todo el honor.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La gloria de Jehová', 'La gloria de Jehová cayó en el monte Sinai,
Y todo el pueblo temblaba de temor.
Hoy esa gloria desciende en su grey,
Llenando de gracia al pueblo del Rey.

Santo, santo es el Señor Jehová,
Su majestad nos estremecerá.
La gloria de Jehová cayó en este lugar,
Vamos todos a adorar.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Despierta iglesia', 'Despierta iglesia, levántate ya,
Que el día de gloria cercano está.
Vístete de ropas de santidad,
Y brilla en medio de la oscuridad.

Llena tu lámpara de aceite santo,
Y entona al cielo tu mejor canto.
Despierta iglesia, levántate ya,
Que el Esposo a la puerta está.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Viene un avivamiento', 'Viene un avivamiento grande y sin igual,
Desde el norte al sur de gloria eternal.
Las almas perdidas a Cristo vendrán,
Y bajo su gracia se postrarán.

Prepárate, pueblo, para cosechar,
La mies del Señor que lista está.
Viene un avivamiento grande y sin igual,
Poder pentecostal.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay una llama encendida', 'Hay una llama encendida en mi ser,
Que alumbra mi senda de noche y de día.
Es el Espíritu del Nazareno,
Que llena mi copa de santa alegría.

Nadie la puede apagar con engaño,
Porque Dios la cuida año tras año.
Hay una llama encendida en mi ser,
Brillando con gran poder.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El poder del Espíritu Santo', 'El poder del Espíritu Santo me guía,
En las horas de prueba y melancolía.
Él rompe cadenas, derriba murallas,
Y me da la victoria en todas las batallas.

Confío en su fuerza, camino en su luz,
Llevando el mensaje de Cristo y la cruz.
El poder del Espíritu Santo me guía,
Por siempre noche y día.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fuego, fuego, fuego', 'Fuego, fuego, fuego que baja del cielo,
Fuego que quema y quita el desvelo.
Fuego que sana al enfermo de dolor,
Y llena la iglesia con santo fervor.

Que caiga la llama en cada rincón,
Que todos adoren con devoción.
Fuego, fuego, fuego que baja del cielo,
Es el fuego del Señor.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Espíritu de Dios desciende', 'Espíritu de Dios desciende sobre mí,
Como paloma blanca en el Jordán.
Abre los cielos y unge mi vida,
Con gracia y poder celestial.

Toca mis labios, unge mis manos,
Para predicar a todos mis hermanos.
Espíritu de Dios desciende sobre mí,
Mi vida rindo a ti.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ven y lléname', 'Ven y lléname, vaso vacío soy,
Ante tu presencia humillado estoy.
Vierte tu aceite de gozo y verdad,
Cólmame de tu santa deidad.

No me dejes ir sin tu bendición,
Sacia la sed de mi corazón.
Ven y lléname, vaso vacío soy,
A tus plantas hoy voy.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero arder por ti', 'Quiero arder por ti, antorcha encendida,
Llevar tu mensaje por toda la vida.
Que no se apague la llama de amor,
Que arda con fuerza en mi Salvador.

En medio de un mundo en oscuridad,
Que brille en mí tu santa verdad.
Quiero arder por ti, antorcha encendida,
Mi alma te es rendida.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay un fuego en la iglesia', 'Hay un fuego en la iglesia que nadie apagará,
Porque es el Espíritu Santo de Jehová.
Unos están orando, otros cantando están,
Y las bendiciones del cielo caerán.

Siente el calor de su dulce presencia,
Rinde tu ser con total reverencia.
Hay un fuego en la iglesia que nadie apagará,
Por los siglos arderá.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pentecostés otra vez', 'Pentecostés otra vez en este lugar,
La promesa de Dios se vuelve a derramar.
Hombres y mujeres llenos de poder,
Anunciando el evangelio por doquier.

Límpiame, Señor, con fuego celestial,
Líbrame de todo pecado y mal.
Pentecostés otra vez en este lugar,
Vamos a glorificar.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Derrama tu Espíritu', 'Derrama tu Espíritu sobre toda carne,
Como lo dijiste por boca de Joel.
Tus hijos e hijas profetizarán,
Y en visiones tu rostro verán.

Señales en el cielo y en la tierra habrá,
Y todo el que invocare a Dios salvo será.
Derrama tu Espíritu sobre toda carne,
Y muéstranos tu poder.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Recibe el fuego', 'Recibe el fuego, recibe el poder,
Que el Espíritu Santo te quiere conceder.
Abre tus manos, levanta tu voz,
Y alaba con gozo al gran Dios.

Salen los males, huye el temor,
Queda la gracia del Salvador.
Recibe el fuego, recibe el poder,
En todo tu bendito ser.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi lámpara está encendida', 'Mi lámpara está encendida con aceite celestial,
Esperando al Esposo en la noche final.
No me quedaré dormido en la vanidad,
Velando en oración y en santidad.

Pronto a la medianoche se oirá el clamor:
¡He aquí viene el Novio, salid al Señor!
Mi lámpara está encendida con aceite celestial,
Lista para el banquete triunfal.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El viento del Espíritu', 'El viento del Espíritu sopla donde quiere,
Oyes su sonido mas no sabes de dónde viene.
Así es todo aquel que es nacido de Dios,
Que obedece humilde su divina voz.

Sopla en mi alma, viento celestial,
Llévame a las cumbres de la santidad.
El viento del Espíritu sopla donde quiere,
Renovando a quien lo quiere.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Renueva mi corazón', 'Renueva mi corazón, oh Señor Jesús,
Pon dentro de mí el fuego de tu luz.
Quita la piedra y dame corazón de carne,
Para amarte y nunca apartarme.

Límpiame con hisopo y seré muy limpio,
Lávame y seré más blanco que la nieve.
Renueva mi corazón, oh Señor Jesús,
En el poder de tu cruz.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bautismo de poder', 'Bautismo de poder necesitamos hoy,
Para testificar por doquiera que voy.
Fuego de Pentecostés que queme la maldad,
Y nos revista de santa autoridad.

Desciende del cielo, llama celestial,
Consagra este templo terrenal.
Bautismo de poder necesitamos hoy,
A ti gloria doy.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La presencia de Dios', 'La presencia de Dios está en este lugar,
La siento en el aire, la siento en el altar.
Un manto de gloria nos cubre con amor,
Sanando las heridas y el dolor.

Quítate las sandalias delante de él,
Que el lugar que pisas santo es.
La presencia de Dios está en este lugar,
Ven y postrado adora ya.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gloria pentecostal', 'Gloria pentecostal inunda la iglesia,
Cánticos celestes entona la grey.
El Espíritu Santo nos guía a la verdad,
Bajo el estandarte de Cristo el buen Rey.

¡Gloria, aleluya, vive el Redentor!
¡Gloria, aleluya, al Dios de amor!
Gloria pentecostal inunda la iglesia,
Con santa devoción.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Arde mi corazón', 'Arde mi corazón en el amor de Dios,
Cuando en las escrituras oigo yo su voz.
Como los de Emaús sintieron su ardor,
Cuando caminaban junto al Salvador.

Quédate con nosotros, la noche viene ya,
Y tu dulce presencia consuelo nos dará.
Arde mi corazón en el amor de Dios,
Siguiendo siempre en pos.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Viento recio', 'Un viento recio del cielo sopló,
Y el aposento alto de gloria llenó.
Todos los creyentes sintieron la unción,
Y salieron predicando con gran convicción.

Sopla hoy de nuevo, viento del Señor,
Aviva nuestras vidas con tu santo amor.
Un viento recio del cielo sopló,
Y el poder de Dios descendió.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay poder en Jesús', 'Hay poder en Jesús para libertar,
Hay poder en Jesús para restaurar.
El Espíritu Santo testifica en mí,
Que por su sacrificio salvo soy aquí.

No hay nada imposible para mi Señor,
Él hace proezas con su gran favor.
Hay poder en Jesús para libertar,
Vamos todos a cantar.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El fuego de Dios está aquí', 'El fuego de Dios está aquí,
Lo siento caer sobre mí.
Quema las impurezas, quita la frialdad,
Y llena mi vida de santidad.

Alaba al Señor que él te llenará,
De su santo fuego que no morirá.
El fuego de Dios está aquí,
¡Aleluya al Gran Yo Soy!', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Avivamiento celestial', 'Avivamiento celestial llueva del cielo hoy,
Rindiendo tributo al Dios a quien voy.
Que las almas se salven, que el pueblo se una,
En una sola fe bajo su columna.

Danos hambre de tu palabra viva,
Danos sed de tu gracia combativa.
Avivamiento celestial llueva del cielo hoy,
Agradecido estoy.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Iglesia, levántate', 'Iglesia, levántate en el nombre de Dios,
Proclama el mensaje con potente voz.
La mies está blanca para cosechar,
El Espíritu Santo te capacitará.

No temas los vientos de la tempestad,
Que contigo va el Dios de verdad.
Iglesia, levántate en el nombre de Dios,
Alza en victoria la voz.', 5);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos más que vencedores', 'Somos más que vencedores por medio de aquel,
Que nos amó en la cruz con amor tan fiel.
Ni la muerte ni la vida nos apartará,
Del amor de Dios que en Cristo está.

En las pruebas y en las luchas firmes de pie,
Caminando en victoria por la fe.
Somos más que vencedores por medio de aquel,
¡Aleluya al Santo Emanuel!', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo rompe las cadenas', 'Cristo rompe las cadenas del pecado y del dolor,
Cristo rompe las cadenas con su mano de amor.
¿Cómo es posible yo vivir sin mi Jesús,
Si el fundamento de mi vida es su luz?

Libre soy, libre soy por su poder,
Una vida nueva en él puedo tener.
Cristo rompe las cadenas del pecado y del dolor,
Gloria al Redentor.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La victoria es mía', 'La victoria es mía, la victoria es mía,
La victoria es mía en el nombre de Jesús.
Si mantengo mi mirada fija en su cruz,
El enemigo huirá de su santa luz.

Satanás no puede contra mi Señor,
Porque él ha triunfado como vencedor.
La victoria es mía, la victoria es mía,
Hoy y cada día.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová peleará por mí', 'Jehová peleará por vosotros, y vosotros estaréis tranquilos,
No temáis delante de los ejércitos enemigos.
Los carros de Faraón en el mar se hundirán,
Y los hijos de Dios victoriosos pasarán.

Su brazo extendido camino abrirá,
La gloria de Dios a su pueblo cubrirá.
Jehová peleará por vosotros, y vosotros estaréis tranquilos,
Confiad en Jehová.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No hay poder más grande', 'No hay poder más grande que el poder de Dios,
Que calma las tormentas y los vientos con su voz.
Ante su presencia los montes temblarán,
Y los reinos de este mundo se postrarán.

Él es el Alfa y Omega, el Principio y el Fin,
Rey de los ejércitos desde la tierra al confín.
No hay poder más grande que el poder de Dios,
Alabemos a una voz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En el nombre de Jesús', 'En el nombre de Jesús hay autoridad,
Para hollar serpientes y toda maldad.
Ningún dardo de fuego nos alcanzará,
Porque el escudo de la fe nos protegerá.

Con la espada del Espíritu que es la verdad,
Marchamos en triunfo hacia la eternidad.
En el nombre de Jesús hay autoridad,
Con entera libertad.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo tengo un Dios poderoso', 'Yo tengo un Dios poderoso que no pierde batallas,
Que derriba murallas y abre puertas cerradas.
Cuando el gigante se levanta contra mí,
En el nombre de Jehová yo lo derribo aquí.

Con una piedrecita y una honda de fe,
En el nombre del Señor victorioso estaré.
Yo tengo un Dios poderoso que no pierde batallas,
A él sea la alabanza.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Satanás está vencido', 'Satanás está vencido bajo nuestros pies,
Por la sangre del Cordero que fue inmolado una vez.
No tiene potestad sobre el pueblo del Señor,
Porque Cristo en el Calvario fue el triunfador.

Levanta bandera de victoria y honor,
Grita con júbilo: ¡Vencí por su amor!
Satanás está vencido bajo nuestros pies,
¡Aleluya al Rey!', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es vencedor', 'Cristo es vencedor, él triunfó sobre la muerte,
Desarmó los principados con su brazo fuerte.
Los exhibió en público triunfando sobre ellos,
Y nos coronó con cánticos bellos.

A él sea la gloria por los siglos de los siglos,
El León de Judá ha vencido el mal.
Cristo es vencedor, él triunfó sobre la muerte,
Soberano inmortal.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Marchando hacia la victoria', 'Marchando hacia la victoria con paso triunfal,
Llevando el evangelio de paz celestial.
Aunque el enemigo nos quiera estorbar,
El Capitán invicto nos hace triunfar.

Firmes en la roca de la salvación,
Con cánticos de fe y de consagración.
Marchando hacia la victoria con paso triunfal,
A la patria eternal.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El enemigo no podrá', 'El enemigo no podrá contra la iglesia de Dios,
Las puertas del Hades no prevalecerán.
Edificada sobre la roca inconmovible está,
Y la gloria de Cristo la sostendrá.

Aunque ruja el león buscando devorar,
El Ángel de Jehová nos guardará.
El enemigo no podrá contra la iglesia de Dios,
Siguiendo siempre en pos.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La batalla es de Jehová', 'No temáis ni os amedrentéis delante de esta multitud,
Porque no es vuestra la guerra, sino de Dios.
Paraos, estad quietos, y ved la salvación,
Que Jehová hará hoy con vuestro corazón.

Alabemos al Señor porque su misericordia es eterna,
Los enemigos caerán ante su presencia tierna.
No temáis ni os amedrentéis delante de esta multitud,
La batalla es de Jehová.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con Cristo venceré', 'Con Cristo venceré toda tentación,
Él guarda mis pasos en toda ocasión.
Su vara y su cayado aliento me dan,
Mesa en mi presencia sus manos pondrán.

Unges mi cabeza con óleo de unción,
Mi copa rebosa de tu bendición.
Con Cristo venceré toda tentación,
En él pongo mi corazón.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No temeré', 'No temeré al terror nocturno,
Ni saeta que vuele de día.
Ni pestilencia que ande en oscuridad,
Ni mortandad que en medio del día destruya.

Caerán a mi lado mil y diez mil a mi diestra,
Mas a mí no llegará por su mano diestra.
No temeré al terror nocturno,
Porque Jehová es mi guardador.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios está conmigo', 'Si Dios es con nosotros, ¿quién contra nosotros?
Él que no escatimó ni a su propio Hijo.
Sino que lo entregó por todos nosotros,
¿Cómo no nos dará también con él todas las cosas?

¿Quién acusará a los escogidos de Dios?
Dios es el que justifica con su santa voz.
Si Dios es con nosotros, ¿quién contra nosotros?
Él es mi fiel abrigo.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay poder en la sangre', 'Hay poder, poder, sin igual poder,
En la sangre de Jesús que vertió en la cruz.
Hay poder, poder, sin igual poder,
En la sangre que me da la luz.

Limpia todo pecado, sana la enfermedad,
Rompe las ataduras con santa autoridad.
Hay poder, poder, sin igual poder,
En la sangre de Jesús.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Las cadenas se romperán', 'Las cadenas se romperán por el poder de Dios,
Las puertas de bronce se desmenuzarán.
Los cerrojos de hierro quebrantados serán,
Y los presos en libertad saldrán.

Alaba con gozo a quien te redimió,
Que de la cautividad te libertó.
Las cadenas se romperán por el poder de Dios,
Alabemos a una voz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Dios nunca falla', 'Mi Dios nunca falla, su palabra es verdad,
Lo que él prometió él lo cumplirá.
Pasarán los cielos, la tierra pasará,
Mas ninguna de sus promesas faltará.

Confía en el Señor con toda tu alma,
Que en medio de la tormenta él te dará calma.
Mi Dios nunca falla, su palabra es verdad,
Por la eternidad.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es mi escudo', 'Jehová es mi escudo y mi gloria es él,
El que levanta mi cabeza con amor tan fiel.
Con mi voz clamé a Jehová desde mi aflicción,
Y él me respondió desde su monte de bendición.

Yo me acosté y dormí, y desperté,
Porque Jehová me sustentaba por la fe.
Jehová es mi escudo y mi gloria es él,
Bendito sea Emanuel.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Venciendo voy', 'Venciendo voy de la mano de Dios,
Ningún obstáculo me detendrá.
En el nombre de Jesús avanzo en pos,
De la corona que no marchitará.

Peleando la buena batalla de la fe,
Con la mirada puesta en lo que no se ve.
Venciendo voy de la mano de Dios,
Alabándole con la voz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gigante caerá', 'El gigante Goliat desafiaba al escuadrón,
Pero David confiaba en el Dios de la salvación.
Tú vienes a mí con espada y jabalina,
Mas yo voy a ti en el nombre de Jehová.

Hoy te entregará el Señor en mi mano,
Y sabrá la tierra que hay Dios soberano.
El gigante caerá por el poder de Dios,
Gritemos con potente voz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo me dio libertad', 'Cristo me dio libertad en la cruz,
Rompió el yugo pesado y me llenó de luz.
Ahora soy libre para alabar,
Libre para su nombre glorificar.

Estad firmes en la libertad gloriosa,
Con que Cristo nos hizo libres y victoriosos.
Cristo me dio libertad en la cruz,
¡Gloria a mi Jesús!', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ninguna arma prosperará', 'Ninguna arma forjada contra ti prosperará,
Y condenarás toda lengua que se levante contra ti.
Esta es la herencia de los siervos de Jehová,
Y su salvación de mí vendrá.

Aunque se unan las fuerzas del mal,
El Señor es tu protector eternal.
Ninguna arma forjada contra ti prosperará,
Su verdad triunfará.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La victoria está en Jesús', 'La victoria no está en las fuerzas humanas,
La victoria está en el nombre de Jesús.
Él venció las huestes celestes y soberanas,
Y en el Calvario derramó su santa luz.

Aferrémonos a su promesa bendita,
Que su poder nuestras vidas capacita.
La victoria está en el nombre de Jesús,
Alabado sea en la cruz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levanta tu estandarte', 'Levanta tu estandarte en el nombre de Dios,
Proclama que Jehová Nissi es tu vencedor.
En medio de la prueba no temas retroceder,
Que la diestra de Cristo te hará vencer.

Avanza con fe, no mires atrás,
Que la tierra prometida poseerás.
Levanta tu estandarte en el nombre de Dios,
Con cánticos de loor.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Marchando como soldados', 'Marchando como soldados de la cruz,
Siguiendo las pisadas de Jesús.
Con el yelmo de la salvación ceñido,
Y el calzado del evangelio bendecido.

En las filas del Rey de reyes estoy,
A la batalla confiado voy.
Marchando como soldados de la cruz,
Guiados por su luz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Poderoso es nuestro Dios', 'Poderoso es nuestro Dios para vencer,
Poderoso para salvar a todo aquel que cree.
Él hace sendas en medio del mar,
Y agua de la peña hace brotar.

Alabad al Fuerte de Israel,
Que con su pueblo camina fiel.
Poderoso es nuestro Dios para vencer,
Gloria a su poder.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El diablo está derrotado', 'El diablo está derrotado por la sangre de Jesús,
Perdió su imperio de maldad en la cruz.
Cristo le quitó las llaves de la muerte,
Y resucitó victorioso y fuerte.

No temas sus mentiras ni su rugir,
Que con Cristo tenemos un nuevo vivir.
El diablo está derrotado por la sangre de Jesús,
Caminemos en la luz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No me moveré', 'Como el árbol plantado junto a corrientes de agua,
Así está mi vida firme en el Señor.
Aunque soplen los vientos de la prueba amarga,
No me moveré de su bendito amor.

Jesús es mi roca inconmovible y fuerte,
Él me libra del lazo y de la muerte.
Como el árbol plantado junto a corrientes de agua,
Firme estaré en él.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios me dará la victoria', 'Dios me dará la victoria en esta aflicción,
Él conoce el clamor de mi oración.
No dejará caído al justo para siempre,
Su mano me levantará alegremente.

Espera en Jehová y haz el bien,
Habita en la tierra y goza su bien.
Dios me dará la victoria en esta aflicción,
Dando gracias de corazón.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Firme en la batalla', 'Firme en la batalla con la armadura de Dios,
Teniendo ceñidos los lomos con la verdad.
Vestidos con la coraza de justicia,
Y el escudo de la fe contra toda iniquidad.

Orando en todo tiempo con ruego y fervor,
Para ser hallados fieles al Salvador.
Firme en la batalla con la armadura de Dios,
Atentos a su voz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi esperanza está en Dios', '¿Por qué te abates, oh alma mía,
Y por qué te turbas dentro de mí?
Espera en Dios, porque aún he de alabarle,
Salvación mía y Dios mío aquí.

De día mandará Jehová su misericordia,
Y de noche su cántico estará conmigo.
Mi esperanza está en el Dios de la gloria,
Mi fiel y santo amigo.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo ha vencido', 'Cristo ha vencido el poder de las tinieblas,
Sobre su trono celestial sentado está.
Nos ha librado de la potestad del abismo,
Y a su reino de luz nos trasladará.

En él tenemos redención por su sangre,
El perdón de pecados por su gracia.
Cristo ha vencido el poder de las tinieblas,
Alabemos con eficacia.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy libre en Jesús', 'Soy libre, soy libre de toda condenación,
Cristo pagó el precio de mi redención.
Ya no hay cadenas que me puedan atar,
Con gozo su nombre voy a proclamar.

Si el Hijo os libertare, seréis verdaderamente libres,
Para adorarle con cánticos sublimes.
Soy libre, soy libre de toda condenación,
Gloria por mi salvación.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La sangre tiene poder', 'La sangre de Cristo tiene poder,
Para limpiar el alma y hacerla renacer.
Cuando el enemigo viene como río contra ti,
El Espíritu de Dios levanta bandera aquí.

Por la sangre del Cordero somos vencedores,
En medio de las luchas y dolores.
La sangre de Cristo tiene poder,
Para siempre defender.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Con Jesús venceremos', 'Con Jesús venceremos todo mal,
Él es nuestro Capitán celestial.
No hay muralla que no caiga a sus pies,
No hay gigante que venza a su grey.

Adelante, pueblo santo, sin vacilar,
Que la victoria nos pertenece en el altar.
Con Jesús venceremos todo mal,
Triunfo inmortal.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor es mi bandera', 'Jehová Nissi, el Señor es mi bandera,
En su nombre cantaremos victoria entera.
Sobre los montes altos ondea su señal,
Llamando a las naciones a su paz eternal.

Con él seremos más que vencedores,
En medio de tribulaciones y dolores.
Jehová Nissi, el Señor es mi bandera,
Por la vida entera.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No hay condenación', 'Ahora, pues, ninguna condenación hay,
Para los que están en Cristo Jesús.
Los que no andan conforme a la carne,
Sino conforme al Espíritu y su luz.

La ley del Espíritu de vida en Cristo,
Me ha librado de la ley del pecado.
Ahora, pues, ninguna condenación hay,
Por su amor comprado.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El poder de la cruz', 'En la cruz del Calvario la batalla se ganó,
Donde Cristo por nosotros su sangre derramó.
Consumado es, el Maestro exclamó,
Y el velo del templo en dos se rasgó.

Tenemos entrada libre al Lugar Santísimo,
Por la sangre preciosa de Jesucristo.
En la cruz del Calvario la batalla se ganó,
Él nos rescató.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos un ejército', 'Somos un ejército marchando en la luz,
Llevando el evangelio del bendito Jesús.
Derribando argumentos y toda altivez,
Que se levanta contra Dios y su grey.

Llevando cautivo todo pensamiento a Cristo,
Para obedecer a su santo designio.
Somos un ejército marchando en la luz,
Fieles a su cruz.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia triunfará', 'La iglesia triunfará sobre toda potestad,
Porque Cristo va al frente en majestad.
Aunque rujan los vientos del turbión,
Permanecerá firme en la oración.

Ni la espada, ni el hambre, ni la persecución,
Apagarán el fuego de su devoción.
La iglesia triunfará sobre toda potestad,
Con santa fidelidad.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El enemigo huirá', 'Someteos, pues, a Dios; resistid al diablo,
Y huirá de vosotros con espanto.
Acercaos a Dios, y él se acercará a vosotros,
Llenando de gracia a todos nosotros.

Limpiaos las manos, pecadores de la tierra,
Y purificad vuestros corazones en la guerra.
Someteos, pues, a Dios; resistid al diablo,
Y huirá de su templo santo.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios es mi libertador', 'Dios es mi libertador y mi protector,
Él sacó mi vida del pozo del terror.
Puso mis pies sobre la firme peña,
Y enderezó mis pasos con su enseña.

Puso en mi boca un cántico nuevo,
Alabanza a nuestro Dios con celo.
Dios es mi libertador y mi protector,
Gloria al Salvador.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Confiaré en Jehová', 'Confiaré en Jehová con todo mi ser,
Y no me apoyaré en mi propia prudencia.
Reconócelo en todos tus caminos,
Y él enderezará tus destinos.

No seas sabio en tu propia opinión,
Teme a Jehová y apártate del error.
Confiaré en Jehová con todo mi ser,
Para siempre vencer.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La victoria de Cristo', 'La victoria de Cristo proclamamos hoy,
Que venció en la cruz y al cielo se fue.
A la diestra del Padre intercediendo está,
Y corona de vida a los suyos dará.

No temáis a los que matan el cuerpo aquí,
Sino a Dios que tiene potestad sobre ti.
La victoria de Cristo proclamamos hoy,
Hacia la gloria voy.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy soldado de Jesús', 'Soy soldado de Jesús, marcho con valor,
Defendiendo la palabra del buen Salvador.
Aunque la batalla sea dura y cruel,
Yo sé que mi Dios es por siempre fiel.

Llevo el casco de la salvación ceñido,
Y la espada de dos filos en mi pecho unido.
Soy soldado de Jesús, marcho con valor,
Siguiendo al Redentor.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No retrocederé', 'No retrocederé, la meta enfrente está,
El premio soberano Dios me otorgará.
Olvidando ciertamente lo que queda atrás,
Avanzo hacia el blanco de la santa paz.

He peleado la buena batalla con fe,
He acabado la carrera y coronado seré.
No retrocederé, la meta enfrente está,
Cristo me sostendrá.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús me hizo libre', 'Jesús me hizo libre de toda opresión,
Cambiando mis cadenas por su salvación.
Ya no soy esclavo del temor ni del mal,
Soy hijo de Dios para vida eternal.

Gozoso camino en su santa verdad,
Testificando al mundo de su bondad.
Jesús me hizo libre de toda opresión,
Doy gracias de corazón.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Poder en el nombre de Cristo', 'Poder, poder en el nombre de Cristo,
Para sanar, libertar y bendecir.
No hay nombre en la tierra ni en el cielo,
Que pueda a las almas la vida impartir.

En su nombre los demonios tienen que huir,
En su nombre los enfermos han de revivir.
Poder, poder en el nombre de Cristo,
Por siempre bendito.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hasta vencer', 'Pelearemos la batalla hasta vencer,
Confiados en la fuerza de su gran poder.
No desmayes hermano, la corona espera allá,
Donde el llanto y la muerte nunca existirán.

Fiel hasta la muerte nos pide el Señor,
Y nos dará la vida en su santo amor.
Pelearemos la batalla hasta vencer,
Alabado sea su ser.', 6);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gracias, Señor', 'Gracias, Señor, por el día tan lindo de hoy,
Gracias, Señor, por la vida y la salud.
Gracias, Señor, por tu amor y perdón,
Que derramas en mi corazón.

Por las pruebas que me enseñan a confiar en ti,
Por tu mano que me guía en mi vivir feliz.
Gracias, Señor, por tu bendición,
A ti doy mi adoración.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te doy gracias', 'Te doy gracias, Señor, de todo corazón,
Delante de los reyes cantaré tu loor.
Porque has engrandecido tu nombre santo,
Y has cambiado mi lamento en canto.

Cuando clamé, me respondiste con amor,
Fortaleciste mi alma con valor.
Te doy gracias, Señor, de todo corazón,
Recibe mi oblación.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios ha sido bueno', 'Dios ha sido bueno, bueno para mí,
Su misericordia nunca tiene fin.
Cuando estuve solo él me levantó,
Y con su palabra me consoló.

¿Qué pagaré a Jehová por sus beneficios?
Ofreceré cánticos y no sacrificios.
Dios ha sido bueno, bueno para mí,
Por siempre cantaré así.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grandes son tus maravillas', 'Grandes son tus maravillas, oh Señor,
Incontables tus obras de amor.
Más que la arena del inmenso mar,
Son las bendiciones que me sabes dar.

Te alabaré con arpa y salterio,
Publicaré tu santo misterio.
Grandes son tus maravillas, oh Señor,
Digno de todo honor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hasta aquí me ayudó Jehová', 'Ebenezer, hasta aquí nos ayudó Jehová,
Su diestra potente nos guardó del mal.
En el desierto y la tempestad,
Nunca faltó su fiel bondad.

Piedra de ayuda es mi Salvador,
Refugio seguro del pecador.
Ebenezer, hasta aquí nos ayudó Jehová,
Su nombre bendito será.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma te bendice', 'Mi alma te bendice, Cordero de Dios,
Por la cruz bendita donde diste tu voz.
Llevaste mis culpas, mi dolor y quebranto,
Y me coronaste con tu manto santo.

No olvidaré ninguno de tus favores,
Tú eres el consuelo de mis dolores.
Mi alma te bendice, Cordero de Dios,
En humilde devoción.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gracias por tu amor', 'Gracias por tu amor incomparable y fiel,
Que me diste en Cristo, dulce Emanuel.
Siendo yo indigno me amaste a mí,
Y una nueva vida encontré en ti.

Amor que no mengua, amor que no falla,
Que en medio del fuego conmigo batalla.
Gracias por tu amor incomparable y fiel,
Por siempre te seré leal.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendiciones de Dios', 'Bendiciones de Dios sobre mi vida están,
Hasta que sobreabunden me colmarán.
Abrirá las ventanas del cielo con poder,
Y lluvia de gracia me hará descender.

No temeré la escasez ni el dolor,
Porque mi sustento es mi Redentor.
Bendiciones de Dios sobre mi vida están,
Mis labios le cantarán.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor me ha bendecido', 'El Señor me ha bendecido en gran manera,
Puso paz y gozo en mi vida entera.
Quitó la tristeza y el llanto amargo,
Y de su misericordia se hizo cargo.

Alégrense los santos con alegría,
Que la bondad de Dios es nueva cada día.
El Señor me ha bendecido en gran manera,
¡Gloria a la vida eterna!', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué bueno es Dios', 'Qué bueno es Dios, qué bueno es Dios,
Qué bueno es Dios para con nosotros.
Nos da su paz, nos da su perdón,
Y llena de gracia el corazón.

Alabadle de mañana, alabadle al anochecer,
Porque sus bondades nunca van a perecer.
Qué bueno es Dios, qué bueno es Dios,
Alabemos a una voz.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios nunca me ha dejado', 'Dios nunca me ha dejado ni me desamparará,
Aunque padre y madre me dejaren, Jehová me recogerá.
Él es mi pronto auxilio en la tribulación,
La roca inconmovible de mi salvación.

En el valle de sombras él va conmigo,
Es mi escudo, mi luz y mi abrigo.
Dios nunca me ha dejado ni me desamparará,
Firme mi fe estará.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cada día con Cristo', 'Cada día con Cristo es más dulce que el anterior,
Cada día con Cristo le amo más y mejor.
Él me salva y me guarda, y sé que pronto vendrá,
Y en las mansiones eternas mi alma morará.

Caminar con Jesús es un gozo sin igual,
Lleno de esperanza y vida celestial.
Cada día con Cristo es más dulce que el anterior,
Gloria al Salvador.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gracias por la vida', 'Gracias por la vida que me diste, Señor,
Gracias por el aire y tu resplandor.
Por el pan que pones en mi mesa diaria,
Y por responder a mi fiel plegaria.

Todo lo que tengo proviene de ti,
Sin tu bendición no podría vivir.
Gracias por la vida que me diste, Señor,
Dador de todo amor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu misericordia es grande', 'Tu misericordia es grande hasta los cielos,
Y hasta las nubes tu fidelidad.
Exaltado seas sobre los cielos, oh Dios,
Y sobre toda la tierra tu gloria.

Para que sean librados tus amados,
Salva con tu diestra y óyeme.
Tu misericordia es grande hasta los cielos,
Te alabaré otra vez.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jehová es bueno', 'Jehová es bueno, fortaleza en el día de la angustia,
Y conoce a los que en él confían.
Aunque la tierra tiemble y los montes caigan,
Los que esperan en Dios nunca se desalientan.

Clemente y compasivo es el Creador,
Lento para la ira y grande en amor.
Jehová es bueno, fortaleza en la aflicción,
Digno de adoración.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios es fiel', 'Dios es fiel, y no permitirá ser tentados,
Más de lo que podáis resistir.
Sino que dará juntamente con la tentación,
La salida para poder soportar y vivir.

Su palabra es firme, no cambiará,
Lo que él comenzó él lo perfeccionará.
Dios es fiel en todo su proceder,
Alabado sea su ser.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi copa está rebosando', 'Mi copa está rebosando de su bendición,
Ungió mi cabeza con santa unción.
Ciertamente el bien y la misericordia,
Me seguirán todos los días de mi historia.

En la casa de Dios moraré por largos días,
Gozando de sus santas melodías.
Mi copa está rebosando de su bendición,
Lleno de devoción.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendice, alma mía', 'Bendice, alma mía, a Jehová,
Y bendiga todo mi ser su santo nombre.
Bendice, alma mía, a Jehová,
Y no olvides ninguno de sus beneficios.

Él es quien perdona todas tus iniquidades,
El que sana todas tus dolencias.
Bendice, alma mía, a Jehová,
Por toda la eternidad.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Todo se lo debo a Él', 'Mi vida, mi casa, mi pan y mi ser,
Todo se lo debo a su gran poder.
Si algo bueno tengo en mi corazón,
Es por su gracia y su salvación.

No me glorío en nada terrenal,
Solo en la cruz de Cristo inmortal.
Todo se lo debo a mi Redentor,
Eterno Salvador.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Nunca me faltará', 'Jehová es mi pastor, nada me faltará,
En lugares de delicados pastos me pastoreará.
Junto a aguas de reposo me guiará con amor,
Confortará mi alma mi fiel Salvador.

Por sendas de justicia me guiará por su nombre,
Para que su alabanza en mi boca asombre.
Jehová es mi pastor, nada me faltará,
Siempre me cuidará.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios cuida de mí', 'Dios cuida de mí bajo su abrigo,
En la noche oscura él es mi testigo.
Si las aves del cielo tienen sustento,
¿Cuánto más sus hijos en todo momento?

Echa sobre Jehová tu pesada carga,
Que él te sostendrá en la noche amarga.
Dios cuida de mí bajo su bendición,
Paz en mi corazón.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi familia está en tus manos', 'Mi familia está en tus manos, oh Señor,
Guárdala en el cerco de tu gran amor.
Que mis hijos te sirvan con consagración,
Y en mi hogar resuene la bendición.

Yo y mi casa serviremos a Jehová,
Nuestra fe en Cristo nunca menguará.
Mi familia está en tus manos, oh Señor,
Llénala de tu favor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gracias por tu fidelidad', 'Grande es tu fidelidad, oh Dios mi Padre,
Nunca se agotan tus misericordias.
Nuevas son cada mañana al despertar,
Tu amor infinito no cesa de brillar.

Tú me sostienes con tu diestra fiel,
Bendito sea el Dios de Israel.
Gracias por tu fidelidad eternal,
Regalo celestial.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El amor de Dios', 'El amor de Dios es tan profundo y ancho,
Que cubre de gracia todo quebranto.
Envió a Jesús a morir por mí,
Para que tuviera vida eterna allí.

¿Quién nos separará de su santo amor?
¿Tribulación, angustia o dolor?
El amor de Dios en Cristo Jesús,
Nos llena de su luz.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me has sostenido', 'Me has sostenido cuando iba a caer,
Tu misericordia me vino a socorrer.
En la multitud de mis pensamientos dentro de mí,
Tus consolaciones alegraban mi alma aquí.

No temeré lo que me pueda hacer el hombre,
Porque confío en tu glorioso nombre.
Me has sostenido con tu mano de amor,
Gracias te doy, Señor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu gracia me alcanzó', 'Tu gracia me alcanzó cuando estaba perdido,
En el fango del pecado hundido y herido.
Extendiste tu mano con tierno perdón,
Y me diste una nueva y santa canción.

Por gracia soy salvo por medio de la fe,
Y no por mis obras, a Dios gloria daré.
Tu gracia me alcanzó en la oscura soledad,
Gracias por tu bondad.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Qué grande es tu amor', 'Qué grande es tu amor, oh Dios celestial,
Más alto que los cielos, más hondo que el mar.
Enviaste a tu Hijo a la cruz a morir,
Para que nosotros pudiéramos vivir.

No hay palabras que alcancen a expresar,
La inmensidad de tu gracia sin par.
Qué grande es tu amor, oh Dios celestial,
Por la eternidad.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendito sea tu nombre', 'Bendito sea tu nombre en la abundancia,
Bendito sea tu nombre en la escasez.
Jehová dio, y Jehová quitó;
Sea el nombre de Jehová bendito otra vez.

En todo tiempo te alabaré con unción,
Rindiendo a tus pies el corazón.
Bendito sea tu nombre, oh Salvador,
Digno de todo honor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi vida es tuya', 'Mi vida es tuya, tómala, Señor,
Hazla un instrumento de tu santo amor.
Pon en mis labios palabras de consuelo,
Para guiar las almas al reino del cielo.

No vivo para mí, vivo para ti,
Desde aquel día en que te recibí.
Mi vida es tuya, tómala, Señor,
Bendito Salvador.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios proveerá', 'Dios proveerá para toda necesidad,
Conforme a sus riquezas en gloria y verdad.
En el monte de Jehová será provisto,
Como el carnero que Abraham vio listo.

No te afanes por el pan de mañana,
Que el Señor derrama su bendición temprana.
Dios proveerá para toda necesidad,
Por su fidelidad.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor es mi pastor', 'El Señor es mi pastor y nada me faltará,
Por sendas de justicia siempre me guiará.
Aunque ande en valle de sombra de muerte,
No temeré mal alguno porque él es mi fuerte.

Tu vara y tu cayado me infundirán aliento,
Mesa aderezas delante de mi asiento.
El Señor es mi pastor y nada me faltará,
Conmigo siempre irá.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu bondad me seguirá', 'Ciertamente el bien y tu bondad me seguirán,
Todos los días de mi vida aquí.
Y en la casa de Jehová moraré por siempre,
Alabando su nombre fervientemente.

No temeré los tropiezos del camino,
Porque Cristo ha marcado mi destino.
Tu bondad me seguirá con tierno amor,
Gracias te doy, Señor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Siempre te alabaré', 'Siempre te alabaré, Señor de los cielos,
En la alegría y en los desvelos.
Porque tú has sido mi roca y mi amparo,
El sol de justicia que brilla bien claro.

De día y de noche cantará mi voz,
Al Dios de mi vida, mi único Dios.
Siempre te alabaré, Señor de los cielos,
Con cánticos sinceros.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Eres mi bendición', 'Eres mi bendición, mi herencia y mi porción,
La alegría que llena mi fiel corazón.
Las cuerdas me cayeron en lugares deleitosos,
Y es hermosa la heredad de los gloriosos.

Bendeciré a Jehová que me aconseja,
Aun en las noches mi corazón me enseña.
Eres mi bendición, mi herencia y mi porción,
Doy gracias con unción.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gracias por salvarme', 'Gracias por salvarme, Jesús de mi vida,
Por curar en mi alma toda honda herida.
Por llevar en tu cuerpo mis culpas y error,
Y darme la paz de tu tierno perdón.

Hoy canto gozoso, lavado en tu sangre,
Deseando que tu amor en mi ser se derrame.
Gracias por salvarme, Jesús de mi vida,
Mi alma te es rendida.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu amor nunca falla', 'Tu amor nunca falla, permanece para siempre,
A través de los siglos sobre el creyente.
Cuando los amigos se alejan de mí,
Tu dulce presencia encuentro yo aquí.

Amor inmutable, amor sin igual,
Que me libra de la muerte y del mal.
Tu amor nunca falla, permanece para siempre,
Alabado eternamente.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Fiel hasta el final', 'Quiero serte fiel hasta el final, Señor,
Guardar tu palabra con santo temor.
Que cuando tú vengas en gloria a reinar,
Pueda con gozo tu rostro mirar.

Sé fiel hasta la muerte, me dice Jesús,
Y yo te daré la corona de luz.
Quiero serte fiel hasta el final, Señor,
En tu bendito amor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios es maravilloso', 'Dios es maravilloso en sus caminos,
Él cambia las penas en santos destinos.
Al que estaba caído levanta del lodo,
Y le da de su gracia y poder en todo.

Alabad a Jehová, naciones enteras,
Pueblos todos, alabadle por doquiera.
Dios es maravilloso en sus caminos,
Nos colma de dones divinos.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Por tu misericordia', 'Por tu misericordia no hemos sido consumidos,
Porque nunca decayeron tus compasiones.
Nuevas son cada mañana en tu santuario,
Grande es tu fidelidad en todo horario.

Mi porción es Jehová, dijo mi alma;
Por tanto, en él esperaré con calma.
Por tu misericordia no hemos sido consumidos,
A ti seamos unidos.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al Dios de mi salvación', 'Al Dios de mi salvación cantaré salmos,
A él levantaré en su templo las manos.
Porque él es mi roca y mi ciudadela,
El que guarda mi alma y por mí vela.

No seré conmovido jamás en su abrigo,
Porque Jehová el Señor camina conmigo.
Al Dios de mi salvación cantaré salmos,
Alabándole con cantos.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma agradecida', 'Mi alma agradecida te rinde loor,
Por tantas victorias que me das, Señor.
En las tempestades fuiste mi abrigo,
En las aflicciones mi mejor amigo.

Que mi vida entera sea para ti,
Un holocausto grato en mi vivir.
Mi alma agradecida te rinde loor,
Bendito Redentor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor me levantó', 'El Señor me levantó del pozo cenagoso,
Y puso mis pies en lugar espacioso.
Enderezó mis pasos en sendas de paz,
Y me enseñó a buscar su santa faz.

Muchos verán esto y temerán,
Y en el nombre de Jehová confiarán.
El Señor me levantó del pozo cenagoso,
Dios todopoderoso.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grande es tu fidelidad', 'Grande es tu fidelidad, oh Dios eterno,
No hay sombras de duda en tu compasión.
Tú no cambias, tus misericordias no faltan,
Como has sido por siempre, así serás.

Paz por el pecado y gozo sin fin,
Tu presencia bendita que alumbra mi vivir.
Grande es tu fidelidad, oh Dios eterno,
Canto con amor tierno.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Gracias por tu presencia', 'Gracias por tu presencia en este lugar,
Que llena de gloria y paz el altar.
Podemos sentir tu fuego divino,
Que alumbra y bendice nuestro camino.

No hay nada mejor que estar junto a ti,
Gozando del cielo prometido allí.
Gracias por tu presencia en este lugar,
Te vamos a adorar.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Bendito Salvador', 'Bendito Salvador, mi fiel Consolador,
A ti doy la gloria y todo el honor.
Por haberme rescatado de la perdición,
Y darme un hogar en tu santa mansión.

Te amaré con el alma, te amaré con el ser,
Hasta el día glorioso en que te he de ver.
Bendito Salvador, mi fiel Consolador,
Eterno Redentor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tú eres mi sustento', 'Tú eres mi sustento en tiempo de sequía,
El pan de cada día que me da alegría.
El agua cristalina que apaga mi sed,
La sombra protectora que abriga mi fe.

En ti confío, Señor de los cielos,
Tú calmas mis penas y mis desvelos.
Tú eres mi sustento en tiempo de sequía,
Mi guía noche y día.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Dios es fiel', 'Mi Dios es fiel, nunca me dejará,
En cada batalla conmigo estará.
Aunque se levanten gigantes de maldad,
Su diestra me libra con autoridad.

Confiaré en su palabra de promesa,
Él adereza ante mí su mesa.
Mi Dios es fiel, nunca me dejará,
Por siempre reinará.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Por siempre te amaré', 'Por siempre te amaré, Señor Jesús,
Por lo que hiciste por mí en la cruz.
Diste tu vida para salvarme,
Y con tu sangre limpia lavarme.

No hay amor más sublime que el tuyo,
En tu gracia me gozo y me instruyo.
Por siempre te amaré, Señor Jesús,
Caminando en tu luz.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Todo lo has hecho bien', 'Todo lo has hecho bien, oh Creador,
En los cielos y en la tierra se ve tu primor.
Hiciste a los sordos oír tu verdad,
Y a los mudos hablar de tu bondad.

Maravillado está mi corazón en ti,
Por tanta gracia que derramas aquí.
Todo lo has hecho bien, oh Creador,
A ti sea el honor.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Agradecido estoy', 'Agradecido estoy por tu salvación,
Por haber cambiado mi pobre corazón.
Me diste un vestido de fiesta y de loor,
Y me llamaste hijo en tu tierno amor.

Hasta el último aliento de mi vida aquí,
Cantaré alabanzas, oh mi Dios, a ti.
Agradecido estoy por tu salvación,
Recibe mi adoración.', 7);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero estar en tu presencia', 'Quiero estar en tu presencia, oh Señor,
Contemplando la hermosura de tu amor.
En el Lugar Santísimo postrado a tus pies,
Donde el alma se llena de tu dulce prez.

Que tu gloria descienda como lluvia en mí,
Es el anhelo con que vengo aquí.
Quiero estar en tu presencia, oh Señor,
Rindiéndote loor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te adoro, Señor', 'Te adoro, Señor, con todo mi corazón,
Levanto mis manos en santa oración.
No hay nadie como tú en la tierra ni el cielo,
Tú eres mi paz, mi gozo y consuelo.

Digno de honra, de gloria y loor,
Jesucristo mi Rey y mi Salvador.
Te adoro, Señor, con todo mi corazón,
En humilde devoción.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corazón te pertenece', 'Mi corazón te pertenece, oh mi Dios,
Toma mi vida, hazla tu habitación.
Que cada latido sea para alabarte,
Y cada suspiro para ensalzarte.

Límpiame de todo lo que no sea tuyo,
En tu santa palabra me gozo y me instruyo.
Mi corazón te pertenece, oh mi Dios,
Atento a tu voz.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cerca de ti', 'Cerca de ti yo quiero habitar,
Bajo tus alas seguras descansar.
Cuando el mundo me ofrece aflicción,
En tu presencia hallo consolación.

Tú eres el río de agua de vida,
Que sana en mi alma toda honda herida.
Cerca de ti yo quiero habitar,
Por siempre en tu altar.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Eres mi refugio', 'Eres mi refugio, mi torre de poder,
En quien mi alma siempre ha de creer.
Aunque rujan los mares y tiemble la tierra,
En tus brazos de amor cesa la guerra.

Torre fuerte es el nombre de Jehová,
A él correrá el justo y seguro estará.
Eres mi refugio, mi torre de poder,
Bendito sea tu ser.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Santo es tu nombre', 'Santo es tu nombre en toda la tierra,
Lleno de gloria, poder y majestad.
Los serafines cantan sin cesar:
¡Santo, Santo, Santo es Jehová!

Postrados ante el trono celestial,
Adoramos al Cordero inmortal.
Santo es tu nombre en toda la tierra,
Tu gloria nos aferra.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma tiene sed de ti', 'Como el ciervo brama por las corrientes de las aguas,
Así clama por ti, oh Dios, el alma mía.
Mi alma tiene sed del Dios vivo,
¿Cuándo vendré y me presentaré delante de Dios?

Fueron mis lágrimas mi pan de día y de noche,
Mas tu misericordia mandará el consuelo.
Mi alma tiene sed del Dios vivo,
Mi amado del cielo.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En tu presencia', 'En tu presencia hay plenitud de gozo,
Delicias a tu diestra para siempre jamás.
El cansado renueva sus fuerzas en ti,
Y halla descanso en su vivir feliz.

No hay lugar más alto que tus pies, Señor,
Donde reina la paz y el tierno amor.
En tu presencia hay plenitud de gozo,
Dios todopoderoso.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te necesito, Señor', 'Te necesito, Señor, en cada momento,
Sin ti desfallece mi débil aliento.
Como la rama necesita la vid,
Así mi alma te necesita a ti.

Sé mi sustento, mi guía y pastor,
Guárdame siempre en tu tierno amor.
Te necesito, Señor, en cada momento,
Eres mi fundamento.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero adorarte', 'Quiero adorarte con un corazón sincero,
Más que sacrificios es lo que tú quieres.
Espíritu y verdad en mi interior,
Dando la gloria a mi Salvador.

Que mi alabanza suba como incienso santo,
Agradable ante el trono de tu encanto.
Quiero adorarte con un corazón sincero,
Es lo que prefiero.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tú eres mi Dios', 'Tú eres mi Dios, y yo te alabaré;
Dios mío, a ti te ensalzaré.
Alabad a Jehová, porque él es bueno;
Porque para siempre es su misericordia.

De madrugada te buscaré con fervor,
Para contemplar tu gloria y amor.
Tú eres mi Dios, y yo te alabaré,
Por siempre cantaré.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aquí estoy, Señor', 'Aquí estoy, Señor, delante de tu altar,
Toma mi vida y hazla de nuevo.
Como el barro en manos del alfarero,
Quebrántame y moldéame con celo.

Quiero ser un vaso útil para ti,
Que lleve tu gracia por doquier aquí.
Aquí estoy, Señor, delante de tu altar,
Dispuesto a adorar.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me rindo ante ti', 'Me rindo ante ti, oh Rey de gloria,
Dejo mis cargas y mi vanagloria.
Todo lo tengo por pérdida aquí,
Por la excelencia de conocerte a ti.

Reina en mi alma con santo poder,
Que tu voluntad se haga en mi ser.
Me rindo ante ti, oh Rey de gloria,
Tuyo es el imperio.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi vida te adora', 'Mi vida te adora, Jesús de mi ser,
No hay dicha más grande que tu rostro ver.
En la intimidad de la santa oración,
Se llena de gozo mi corazón.

Te amo, mi Dios, te amo, Señor,
Eres la fuente de mi salvación.
Mi vida te adora, Jesús de mi ser,
Por todo tu poder.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús, mi amado', 'Jesús, mi amado, el más bello entre diez mil,
Tu amor es más dulce que el vino de abril.
Tus ojos de fuego, tu voz como aguas,
Llenan mi alma de santas palabras.

A ti me entrego con devoción,
Dueño absoluto de mi corazón.
Jesús, mi amado, el más bello entre diez mil,
Bendito Redentor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Solo tú eres digno', 'Solo tú eres digno de adoración,
Solo tú mereces la exaltación.
Creador de los cielos, del mar y la tierra,
En quien toda alma confiada espera.

Los ángeles cantan tu santidad,
La iglesia proclama tu gran bondad.
Solo tú eres digno de adoración,
Recibe esta canción.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Reina en mi corazón', 'Reina en mi corazón, bendito Jesús,
Sé el soberano de mi vivir.
Que cada pensamiento rinda a tu luz,
Para agradarte hasta morir.

Siéntate en el trono de mi interior,
Y quita de mí todo vano amor.
Reina en mi corazón, bendito Jesús,
Guiándome en tu cruz.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi refugio eres tú', 'Mi refugio eres tú en la tempestad,
La roca que guarda mi debilidad.
Bajo la sombra de tus alas moraré,
Y ningún mal jamás temeré.

Dios es nuestro amparo y fortaleza,
Pronto auxilio en toda tristeza.
Mi refugio eres tú en la tempestad,
Fuente de verdad.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te exaltaré por siempre', 'Te exaltaré por siempre, Señor mi Rey,
Publicaré tus obras en medio de tu grey.
Generación a generación celebrará,
Las maravillas que tu diestra hará.

Clemente y misericordioso es Jehová,
Lento para la ira y grande en bondad.
Te exaltaré por siempre, Señor mi Rey,
Guardando tu santa ley.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma te busca', 'Mi alma te busca en la noche serena,
Cuando todo calla y se calma la pena.
En la vigilia medito en tu ley,
Y hallo descanso a los pies del buen Rey.

Mejor es un día en tus atrios, Señor,
Que mil fuera de ellos en falso resplandor.
Mi alma te busca en la noche serena,
De tu gracia llena.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero contemplar tu gloria', 'Una cosa he demandado a Jehová, esta buscaré:
Que esté yo en la casa de Jehová todos los días.
Para contemplar la hermosura de Jehová,
Y para inquirir en su santo templo.

Porque él me esconderá en su tabernáculo,
En el día del mal me pondrá sobre peña.
Quiero contemplar tu gloria y bondad,
Por la eternidad.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tú eres santo', 'Tú eres santo, santo, santo,
Rodeado de gloria y de luz.
Los cielos y la tierra proclaman,
La victoria de tu santa cruz.

Nos postramos en tu presencia hoy,
Diciendo: ¡Santo es el Gran Yo Soy!
Tú eres santo, santo, santo,
Bendito Emanuel.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En tus manos estoy', 'En tus manos estoy, oh Salvador,
Seguro en tu cerco de amor.
Nadie me podrá arrebatar de ti,
Porque tú me compraste a mí.

Mi vida, mi tiempo y mi porvenir,
A tus santos pies quiero rendir.
En tus manos estoy, oh Salvador,
Mi fiel protector.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi adoración es para ti', 'Mi adoración es para ti, Señor,
No la daré a nadie más.
Solo tú salvaste mi corazón,
Y me diste tu bendita paz.

Que suba a tu trono como olor grato,
El cántico humilde de este siervo.
Mi adoración es para ti, Señor,
Con todo mi amor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Dios de mi vida', 'Dios de mi vida, mi fortaleza y luz,
Mi alma descansa al pie de tu cruz.
En los momentos de dura aflicción,
Tu santo consuelo es mi galardón.

No temeré lo que pueda pasar,
Porque a tu diestra he de morar.
Dios de mi vida, mi fortaleza y luz,
Alabado seas, Jesús.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Más de ti, Señor', 'Más de ti, Señor, y menos de mí,
Que mengüe mi yo para que crezcas tú.
Quiero reflejar tu imagen bendita,
Conforme tu Espíritu me capacita.

Límpiame de toda vana altivez,
Y vísteme de humilde sencillez.
Más de ti, Señor, y menos de mí,
Consagrado a ti.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('A tus pies', 'A tus pies derramo mi perfume hoy,
Como aquella mujer que te ungió.
Lágrimas de amor y de gratitud,
Por haberme dado la salud.

Tus pies traspasados por mi maldad,
Son mi refugio de santidad.
A tus pies derramo mi perfume hoy,
A tus plantas voy.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corazón te canta', 'Mi corazón te canta, Jesús mi Salvador,
Un cántico ferviente de íntimo amor.
Tú llenas el vacío de mi interior,
Con el consuelo de tu resplandor.

Por siempre y para siempre te exaltaré,
Y en tu santa palabra confiaré.
Mi corazón te canta, Jesús mi Salvador,
Digno de loor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te glorificaré', 'Te glorificaré, Señor mi Dios,
Con todo mi corazón y mi ser.
Glorificaré tu nombre para siempre,
Porque tu misericordia es grande sobre mí.

Libraste mi alma de la fosa profunda,
Y me coronaste de gracia fecunda.
Te glorificaré, Señor mi Dios,
Alabándote con la voz.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Eres mi paz', 'Tú guardarás en completa paz,
A aquel cuyo pensamiento en ti persevera.
Porque en ti ha confiado de veras,
Y en tu palabra halla su paz.

Confiad en Jehová perpetuamente,
Porque en Jehová el Señor está la fortaleza.
Eres mi paz en medio del vendaval,
Consuelo eternal.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma descansa en ti', 'En Dios solamente descansa mi alma;
De él viene mi salvación.
Él solamente es mi roca y mi refugio;
Es mi amparo, no resbalaré mucho.

De Dios es el poder y la misericordia,
En sus atrios hallo mi gloria.
En Dios solamente descansa mi alma,
Con perfecta calma.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Solo Cristo', 'Solo Cristo puede satisfacer,
El anhelo más hondo de mi ser.
El agua del mundo sed volverá a dar,
Mas el agua de Cristo para siempre saciará.

Fuente de vida saltando para eternidad,
Ríos de gozo y de verdad.
Solo Cristo puede satisfacer,
Alabado sea su poder.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tú eres mi todo', 'Tú eres mi todo, mi pan y mi abrigo,
Mi Salvador y mi mejor amigo.
Si te tengo a ti, ¿qué más puedo desear?
En los cielos y en la tierra no hay nada igual.

Mi porción es Jehová por la eternidad,
Mi herencia de gracia y felicidad.
Tú eres mi todo, mi pan y mi abrigo,
Siempre contigo.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero verte, Señor', 'Quiero verte, Señor, en santidad,
Cara a cara en la eternidad.
Limpia mi alma con sangre carmesí,
Para que pueda morar junto a ti.

Bienaventurados los de limpio corazón,
Porque ellos verán a Dios en su mansión.
Quiero verte, Señor, en santidad,
Por tu gran piedad.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi espíritu te alaba', 'Mi espíritu te alaba en adoración,
En el Lugar Secreto de la comunión.
Lejos del ruido y de la vanidad,
Postrado ante el Dios de majestad.

Habla, Señor, que tu siervo oye,
Tu dulce voz mi espíritu acoge.
Mi espíritu te alaba en adoración,
Con devoción.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Aquí está mi adoración', 'Aquí está mi adoración, Señor,
Recíbela como ofrenda de amor.
No traigo riquezas de plata ni oro,
Mi corazón rendido es mi tesoro.

Que sea grato a ti mi cantar,
Delante de tu trono en el altar.
Aquí está mi adoración, Señor,
A ti doy el honor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tu presencia me llena', 'Tu presencia me llena de fortaleza y paz,
Cuando en oración busco tu santa faz.
Las dudas se disipan, se va todo temor,
Al sentir el abrazo de mi Salvador.

Quédate conmigo, Señor Jesús,
Alumbra mi senda con tu santa luz.
Tu presencia me llena de fortaleza y paz,
Nunca me dejarás.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Digno de adoración', 'Digno de adoración es el Santo Cordero,
Que fue inmolado en el santo madero.
A él sea el poder, la riqueza y la sabiduría,
La fortaleza, la honra y la gloria de por vida.

Al que está sentado en el trono cantemos,
Y al Cordero por siempre adoremos.
Digno de adoración es el Santo Cordero,
Rey verdadero.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi amado Salvador', 'Mi amado Salvador, cuánto te quiero yo,
Desde aquel día en que tu amor me salvó.
Tú eres el lirio de los valles más puros,
La rosa de Sarón que alumbra lo oscuro.

En tus atrios yo quiero habitar,
Y tu santa palabra guardar.
Mi amado Salvador, cuánto te quiero yo,
A ti me rindo hoy.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tú eres mi fortaleza', 'Tú eres mi fortaleza en la tribulación,
El Dios que responde a mi oración.
Aunque los montes se traspasen al corazón del mar,
En tus promesas firmes voy a confiar.

Jehová de los ejércitos está con nosotros,
Nuestro refugio es el Dios de Jacob.
Tú eres mi fortaleza en la tribulación,
De corazón.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En tus brazos', 'En tus brazos de amor seguro estoy,
A donde tú me guíes gozoso voy.
Ni el peligro ni la espada me apartarán,
Tus alas protectoras me cubrirán.

Descanso en tu fidelidad y bondad,
Rodeado de tu santa deidad.
En tus brazos de amor seguro estoy,
A ti gloria doy.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Adoración sincera', 'Una adoración sincera te quiero dar,
Sin fingimiento en tu santo altar.
Un corazón contrito y humillado a ti,
Que busque agradarte en su vivir.

No despreciarás al que clama con fe,
En tu misericordia me gozaré.
Una adoración sincera te quiero dar,
Al Dios sin par.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Te amo, Jesús', 'Te amo, Jesús, con todo mi corazón,
Porque diste tu vida por mi redención.
Antes que yo te amara me amaste a mí,
Y tu perdón eterno recibí.

No hay amor más grande en el universo,
Que el amor que describes en cada verso.
Te amo, Jesús, con todo mi corazón,
En santa comunión.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Solo a ti adoraré', 'Solo a ti adoraré, Dios de Israel,
Porque no hay dioses semejantes a él.
Los ídolos del mundo nada pueden hacer,
Mas Jehová los cielos hizo con poder.

A él sea la gloria y la alabanza hoy,
Postrado ante sus plantas estoy.
Solo a ti adoraré, Dios de Israel,
Eternamente fiel.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Rey de gloria', '¿Quién es este Rey de gloria?
Jehová el fuerte y valiente en batalla.
Alzad, oh puertas, vuestras cabezas,
Y entrará el Rey de gloria con grandeza.

Él reina con cetro de justicia y poder,
Todo su pueblo le ha de temer.
¿Quién es este Rey de gloria?
Jesucristo el Señor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corazón es tuyo', 'Mi corazón es tuyo, Maestro celestial,
Límpialo de todo pensamiento carnal.
Pon en mí los frutos del Espíritu Santo,
Amor, gozo, paz y benigno manto.

Que mi testimonio alumbre la grey,
Siguiendo las pisadas del buen Rey.
Mi corazón es tuyo, Maestro celestial,
Para siempre leal.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Grande eres tú', 'Grande eres tú, y haces maravillas;
Solo tú eres Dios.
Enséñame, oh Jehová, tu camino;
Caminaré yo en tu verdad.

Afirma mi corazón para que tema tu nombre,
Te alabaré, oh Jehová Dios mío, con todo el corazón.
Grande eres tú, y haces maravillas,
De gloria y loor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma te glorifica', 'Mi alma te glorifica, oh Señor,
Y mi espíritu se regocija en ti.
Porque has hecho en mi vida grandes portentos,
Y has saciado mi boca de alimentos.

Tu misericordia sobre los que te temen está,
De generación en generación permanecerá.
Mi alma te glorifica, oh Señor,
Con reverente amor.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús, mi Señor', 'Jesús, mi Señor, mi Maestro y mi Dueño,
Servirte con gozo es mi mayor empeño.
No hay mayor honor en esta tierra que ser,
Un siervo que cumpla con todo tu deber.

Guíame en tus sendas de paz y verdad,
Hasta llegar a tu santa ciudad.
Jesús, mi Señor, mi Maestro y mi Dueño,
Bajo tu amparo me adueño.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Toda gloria para ti', 'Toda gloria para ti, Cordero inmolado,
Que en la cruz del Calvario fuiste traspasado.
Por tu sangre nos diste perdón y libertad,
Y nos hiciste pueblo de santidad.

Alabanza, honra, gloria y loor,
Por los siglos de los siglos al Redentor.
Toda gloria para ti, Cordero inmolado,
Por siempre exaltado.', 8);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo era perdido', 'Yo era perdido en el mundo y sin Dios,
Caminando en sombras sin oír su voz.
Mas Cristo en su gracia me vino a buscar,
Y con su perdón me enseñó a cantar.

Ahora soy salvo por su grande amor,
Tengo vida eterna con mi Salvador.
Yo era perdido en el mundo y sin Dios,
Hoy sigo en su pos.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo me salvó', 'Cristo me salvó de la condenación,
Pagó mi rescate con su santo perdón.
En la cruz sangrienta mi deuda canceló,
Y a su reino eterno mi alma trasladó.

Cantaré por siempre de su salvación,
Proclamando al mundo su resurrección.
Cristo me salvó de la condenación,
De todo corazón.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una nueva criatura', 'De modo que si alguno está en Cristo,
Nueva criatura es.
Las cosas viejas pasaron,
He aquí todas son hechas nuevas.

Ya no vivo en tinieblas de maldad,
Camino en la senda de su verdad.
De modo que si alguno está en Cristo,
Nueva criatura es.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ya no soy el mismo', 'Ya no soy el mismo de ayer,
Cristo transformó mi vivir.
Puso en mis labios una canción,
Y llenó de paz mi corazón.

El viejo hombre quedó enterrado,
En Cristo Jesús he resucitado.
Ya no soy el mismo de ayer,
Por su gran poder.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús cambió mi vida', 'Jesús cambió mi vida de dolor y llanto,
Y me vistió con su bendito manto.
Donde había espinas puso flores de paz,
Y me enseñó a buscar su santa faz.

Testifico al mundo de su gran bondad,
Que Cristo liberta con autoridad.
Jesús cambió mi vida de dolor y llanto,
Por un dulce canto.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy redimido', 'Soy redimido por la sangre de Jesús,
Comprado a precio en la cruenta cruz.
Satanás ya no tiene parte en mi ser,
Porque pertenezco al Rey de poder.

Digan los redimidos de Jehová:
¡Su misericordia para siempre durará!
Soy redimido por la sangre de Jesús,
Caminando en su luz.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Libre soy', 'Libre soy, libre soy, las cadenas cayeron,
Las puertas de bronce se abrieron.
El carcelero temblando cayó,
Cuando la gloria de Dios descendió.

Si el Hijo os libertare seréis libres,
Para cantar con júbilos sublimes.
Libre soy, libre soy, las cadenas cayeron,
Al suelo se fueron.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo vive en mí', 'Con Cristo estoy juntamente crucificado,
Y ya no vivo yo, mas vive Cristo en mí.
Y lo que ahora vivo en la carne,
Lo vivo en la fe del Hijo de Dios.

El cual me amó y se entregó a sí mismo por mí,
Para darme vida eterna y feliz.
Con Cristo estoy juntamente crucificado,
Él me ha redimido.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi testimonio', 'Este es mi testimonio de fe y de verdad,
Que Cristo me sacó de la oscuridad.
Andaba errante, ciego y sin paz,
Mas su tierno amor me cubrió jamás.

Ven a Jesús, amigo pecador,
Y conocerás al divino Salvador.
Este es mi testimonio de fe y de verdad,
Para la eternidad.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Él me rescató', 'Él me rescató del pozo de la muerte,
Con su brazo fuerte me sostuvo.
Puso mis pies sobre la firme roca,
Y una nueva alabanza puso en mi boca.

Alabaré a Jehová mientras tenga aliento,
Porque él me libró de todo tormento.
Él me rescató del pozo de la muerte,
Dios grande y fuerte.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('De las tinieblas a la luz', 'De las tinieblas a su luz admirable,
Nos ha llamado el Señor de amor.
Para que anunciemos las virtudes santas,
De nuestro divino y fiel Redentor.

Vosotros que en otro tiempo no erais pueblo,
Pero que ahora sois pueblo de Dios.
De las tinieblas a su luz admirable,
Sigamos en pos.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy hijo del Rey', 'Soy hijo del Rey, linaje escogido,
Por la sangre santa de Cristo redimido.
No tengo riquezas que el mundo aprecie,
Mas tengo un tesoro que nunca fenezca.

En las bodas del Cordero me sentaré,
Y cara a cara a mi Salvador veré.
Soy hijo del Rey, linaje escogido,
Por Dios bendecido.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La sangre de Cristo', 'La sangre de Cristo tiene poder,
Para lavar el pecado de todo ser.
Más blanca que la nieve mi alma dejó,
Cuando en el Calvario su vida entregó.

Ni plata ni oro nos pudo rescatar,
Solo su sangre en el santo altar.
La sangre de Cristo tiene poder,
Para vencer.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús es mi Salvador', 'Jesús es mi Salvador, mi amigo fiel,
El lirio de los valles, el Emanuel.
En él encontré el perdón y la paz,
Y de su gracia me colma más y más.

No hay otro nombre dado a los hombres,
En quien podamos salvación tener.
Jesús es mi Salvador, mi amigo fiel,
Por siempre loor a él.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me encontró el Señor', 'Me encontró el Señor como oveja perdida,
Descarriado en montes de dolor y herida.
Me puso en sus hombros con tierno amor,
Y me trajo al redil del buen Pastor.

Hubo gran fiesta en la casa celestial,
Por un pecador rescatado del mal.
Me encontró el Señor como oveja perdida,
Me dio nueva vida.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi vida transformó', 'Mi vida transformó el toque de su mano,
Todo mi pasado lo perdonó temprano.
Puso en mis ojos visión celestial,
Y en mi corazón su amor inmortal.

Canto aleluya al Dios de mi salud,
Que me coronó de gracia y virtud.
Mi vida transformó el toque de su mano,
Soberano Rey.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy lavado por su sangre', 'Soy lavado por su sangre carmesí,
De mis pecados limpio soy aquí.
El acta de los decretos contra mí,
La clavó en la cruz muriendo allí.

Desarmó los principados y potestades,
Triunfando sobre ellos en libertades.
Soy lavado por su sangre carmesí,
Vivo feliz.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo me dio esperanza', 'Cristo me dio esperanza y seguridad,
En medio de un mundo lleno de maldad.
Tengo la certeza de su santa venida,
Y de morar con él por toda la vida.

Ancla del alma, firme y segura,
Que penetra hasta la gloria pura.
Cristo me dio esperanza y seguridad,
Por su bondad.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El camino de salvación', 'Jesús es el camino, la verdad y la vida;
Nadie viene al Padre sino por él.
La puerta estrecha que lleva a la gloria,
Donde cantaremos la eterna victoria.

Entrad por la puerta santa y bendita,
Que a la presencia de Dios nos invita.
Jesús es el camino, la verdad y la vida,
Fuente prometida.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Nací de nuevo', 'Nací de nuevo del agua y del Espíritu,
Para entrar al reino de mi Señor.
El viejo hombre quedó sepultado,
Y el nuevo hombre ha resucitado.

Hijo de Dios soy por adopción,
Sellado con las arras de la redención.
Nací de nuevo del agua y del Espíritu,
Por su Santo Espíritu.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Ya tengo una esperanza', 'Ya tengo una esperanza que no avergüenza,
Porque el amor de Dios ha sido derramado.
En nuestros corazones por el Espíritu Santo,
Que nos fue dado con tierno manto.

Esperanza viva por la resurrección,
De Jesucristo nuestro Campeón.
Ya tengo una esperanza que no avergüenza,
Firme recompensa.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy de Cristo', 'Soy de Cristo, a él pertenezco,
Su santo nombre en mi pecho merezco.
Ninguna condenación hay para mí,
Porque en su sangre limpia creí.

¿Quién me apartará de su amor eternal?
Ni la vida, ni la muerte, ni el mal.
Soy de Cristo, a él pertenezco,
A él me ofrezco.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús me levantó', 'Jesús me levantó del fango cenagoso,
Me vistió de lino limpio y glorioso.
Puso un anillo en mi mano de amor,
Y calzado en mis pies de seguidor.

Comamos y hagamos fiesta de loor,
Porque este hijo muerto resucitó.
Jesús me levantó del fango cenagoso,
Dios bondadoso.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor me perdonó', 'El Señor me perdonó toda mi maldad,
Arrojó mis culpas a lo profundo del mar.
Nunca más se acordará de mi pecado,
Porque por la sangre fui justificado.

Bendito el Dios de toda compasión,
Que llena de paz mi humilde corazón.
El Señor me perdonó toda mi maldad,
Con tierna bondad.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi pasado quedó atrás', 'Mi pasado quedó atrás en el madero,
Sepultado para siempre con Jesús.
Hoy camino como siervo verdadero,
Alumbrado por su bendita luz.

Las cosas viejas pasaron ya,
Todo nuevo en Cristo será.
Mi pasado quedó atrás en el madero,
Soy heredero.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tengo vida eterna', 'El que cree en el Hijo tiene vida eterna,
No vendrá a condenación jamás.
Ha pasado de muerte a vida en su gracia,
Y en su gloria celestial descansará.

Esta es la promesa que él nos dio:
Vida eterna en Cristo que nos amó.
El que cree en el Hijo tiene vida eterna,
Paz sempiterna.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo me libertó', 'Cristo me libertó del yugo de esclavitud,
Me sacó de las tinieblas a su salud.
Ya no sirvo al pecado ni a la maldad,
Sirvo a Jesucristo en santidad.

Estad firmes en la santa libertad,
Que nos dio el Cordero de la verdad.
Cristo me libertó del yugo de esclavitud,
Con prontitud.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La gracia me alcanzó', 'La gracia de Dios que trae salvación,
Se ha manifestado a toda la creación.
Enseñándonos a renunciar a la impiedad,
Y a vivir sobria y justamente en verdad.

Aguardando la esperanza bienaventurada,
De nuestro gran Dios y Salvador Jesús.
La gracia de Dios que trae salvación,
En mi corazón.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Su amor me rescató', 'Su amor me rescató cuando no había salida,
En medio de la noche oscura y perdida.
Brilló la estrella de la mañana en mi ser,
Y me dio la fuerza para renacer.

Amor inmenso, divino y fiel,
Que me une a Cristo Emanuel.
Su amor me rescató cuando no había salida,
Nueva es mi vida.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy salvo por Jesús', 'Soy salvo por Jesús y su misericordia,
No por obras mías de justicia alguna.
Sino por el lavamiento de la regeneración,
Y por la renovación del Espíritu Santo.

Justificados por su gracia divina,
Herederos de la gloria que nos destina.
Soy salvo por Jesús y su misericordia,
Canto su memoria.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El mundo no me llena', 'El mundo no me llena con sus vanidades,
Sus placeres pasan como niebla en la tarde.
Mas el que hace la voluntad de Dios,
Permanece para siempre oyendo su voz.

Puse mis ojos en el reino celestial,
Donde está mi tesoro inmortal.
El mundo no me llena con sus vanidades,
Rindo potestades.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi nombre está escrito', 'No os regocijéis de que los espíritus se os sujetan,
Sino regocijaos de que vuestros nombres.
Están escritos en los cielos en el libro de la vida,
Por la sangre del Cordero prometida.

Allá en la gloria mi nombre escrito está,
Y nadie de su libro lo borrará.
Regocijaos porque vuestros nombres están escritos,
En los cielos benditos.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es mi vida', 'Porque para mí el vivir es Cristo,
Y el morir es ganancia eterna.
En él tengo mi paz y mi esperanza,
Y a su nombre dirijo mi alabanza.

Si vivo, para el Señor vivo hoy,
Si muero, del Señor soy.
Porque para mí el vivir es Cristo,
Santo e invicto.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una historia diferente', 'Una historia diferente Cristo escribió en mí,
Desde aquel momento en que a sus pies me rendí.
Cambió mi tristeza en gozo verdadero,
Y me inscribió en el libro del Cordero.

Ya no lloro como los que no tienen fe,
En la palabra de mi Dios descansaré.
Una historia diferente Cristo escribió en mí,
Vivo feliz.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma fue rescatada', 'Mi alma fue rescatada del lazo del cazador,
Se rompió el lazo y escapamos nosotros.
Nuestro socorro está en el nombre de Jehová,
Que hizo los cielos y la tierra.

No caí en la trampa del enemigo cruel,
Porque me guardó el Santo de Israel.
Mi alma fue rescatada del lazo del cazador,
Gloria al Redentor.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jesús es el camino', 'Jesús es el camino que nos lleva al Padre,
La verdad que nos hace libres de maldad.
La vida abundante que sacia el corazón,
Y nos asegura la salvación.

Nadie viene al Padre sino por él,
El Mediador bendito, Cristo Emanuel.
Jesús es el camino que nos lleva al Padre,
Paz inefable.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No vuelvo atrás', 'He decidido seguir a Cristo,
He decidido seguir a Cristo.
He decidido seguir a Cristo,
No vuelvo atrás, no vuelvo atrás.

La cruz delante y el mundo atrás,
La cruz delante y el mundo atrás.
He decidido seguir a Cristo,
No vuelvo atrás, jamás.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Me rescató del pecado', 'Me rescató del pecado y de la perdición,
Dándome un vestido de fiesta y unción.
Quitó los harapos de mi vieja vida,
Y me dio su gracia bendecida.

Alabemos al que nos amó primero,
Y nos redimió en el santo madero.
Me rescató del pecado y de la perdición,
De corazón.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay esperanza en Cristo', 'Hay esperanza en Cristo para el afligido,
Para el quebrantado y el desvalido.
Venid a mí todos los que estáis trabajados,
Y yo os haré descansar libertados.

Llevad mi yugo sobre vosotros y aprended,
Que soy manso y humilde de corazón.
Hay esperanza en Cristo para el afligido,
En él confío.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy nueva criatura', 'Soy nueva criatura en Cristo Jesús,
Lleno de su gracia y de su santa luz.
El pecado no se enseñoreará de mí,
Porque bajo la gracia camino aquí.

Siervos de justicia somos para Dios,
Obedientes siempre a su tierna voz.
Soy nueva criatura en Cristo Jesús,
Fiel a su cruz.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corazón cambió', 'Mi corazón cambió cuando Cristo entró,
Toda la amargura de mi alma quitó.
Puso un amor sincero hacia mi hermano,
Y me extendió su bondadosa mano.

Ahora vivo en comunión y en santidad,
Gozando de su dulce y santa paz.
Mi corazón cambió cuando Cristo entró,
Me rescató.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor me llamó', 'El Señor me llamó con santo llamamiento,
No conforme a mis obras ni a mi talento.
Sino según el propósito suyo y la gracia,
Que nos fue dada en Cristo con eficacia.

Manifestada por la aparición del Salvador,
Que quitó la muerte y sacó la luz del amor.
El Señor me llamó con santo llamamiento,
Con santo aliento.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La cruz me dio vida', 'En la cruz del Calvario encontré la vida,
Donde la deuda de mi alma fue saldada.
Las heridas de Jesús me dieron sanidad,
Y su sacrificio santa libertad.

Gloria sea a la cruz de mi Señor,
Emblema eterno de su tierno amor.
En la cruz del Calvario encontré la vida,
Alma bendecida.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Salvador vive', 'Yo sé que mi Redentor vive,
Y al fin sobre la tierra se levantará.
Y aunque deshecha esté esta mi piel,
En mi carne he de ver a Dios muy fiel.

Al cual veré por mí mismo con devoción,
Y mis ojos lo verán y no otro.
Yo sé que mi Redentor vive,
Mi salvación.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Tengo un nuevo corazón', 'Tengo un nuevo corazón para amar a Dios,
Para obedecer los mandatos de su voz.
Él quitó el corazón de piedra insensible,
Y me dio un corazón sensible y apacible.

Escribió su ley en mi mente y mi ser,
Para nunca más volver a retroceder.
Tengo un nuevo corazón para amar a Dios,
En humilde pos.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo me dio libertad', 'Estad, pues, firmes en la libertad,
Con que Cristo nos hizo libres del mal.
Y no estéis otra vez sujetos al yugo,
De la servidumbre y del verdugo.

Porque vosotros, hermanos, a libertad fuisteis llamados,
Para servirnos por amor unos a otros.
Estad, pues, firmes en la libertad,
Con santidad.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Soy propiedad de Dios', 'Soy propiedad de Dios, comprado por su amor,
No me pertenezco, soy de mi Señor.
Glorificad, pues, a Dios en vuestro cuerpo,
Y en vuestro espíritu que son de Dios.

Templo del Espíritu Santo soy aquí,
Para adorarle en todo mi vivir.
Soy propiedad de Dios, comprado por su amor,
Mi Redentor.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Vivo para Cristo', 'Vivo para Cristo y su santa gloria,
Él me concedió la eterna victoria.
Nada en este mundo me podrá apartar,
De su santa senda que me hace triunfar.

Si vivimos, para el Señor vivimos con fe,
Y en su santo nombre me deleitaré.
Vivo para Cristo y su santa gloria,
Canto su historia.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El amor que me salvó', 'El amor de Dios que en la cruz brilló,
Fue el amor sublime que me rescató.
No hay palabras humanas para describir,
La grandeza inmensa de su redimir.

Alabanzas y gloria le tributaré,
Y por los siglos su nombre ensalzaré.
El amor de Dios que en la cruz brilló,
Me redimió.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Su gracia es suficiente', 'Bástate mi gracia; porque mi poder,
Se perfecciona en la debilidad del ser.
Por tanto, de buena gana me gloriaré,
En mis debilidades para que repose Cristo.

Cuando soy débil, entonces soy fuerte,
Porque la gracia de Jesús vence la muerte.
Bástate mi gracia; porque mi poder,
Me hace vencer.', 9);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos el pueblo de Dios', 'Somos el pueblo de Dios,
Somos un pueblo especial,
Llamados para anunciar
Las virtudes de aquel que nos llamó.

Somos el pueblo de Dios,
Su sangre nos redimió,
Y su Espíritu dio
Para darnos poder y proclamar.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia está de fiesta', 'La iglesia está de fiesta,
Alegre y victoriosa,
Alabando al Cordero,
La esposa jubilosa.

Cantando con el alma,
Danzando con fervor,
La iglesia está de fiesta
En la presencia del Señor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Unidos en Cristo', 'Unidos, unidos, en su nombre unidos,
Unidos, unidos, en su amor.
Pues en este mundo paz y amor tendremos,
Unidos muy juntos en el Señor.

Tomados de la mano la carrera correremos,
La gloria de Dios juntos contemplaremos.
Unidos, unidos, en su nombre unidos,
Unidos en el Señor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos una familia', 'Somos una familia en el amor de Dios,
Un solo cuerpo en Cristo, oyendo su voz.
No hay barrera que nos pueda separar,
Porque su amor nos une para amar.

Si un hermano sufre, sufrimos con él,
Si se goza en triunfo, cantamos con fe.
Somos una familia en el amor de Dios,
Unidos en adoración.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levántate, iglesia', 'Levántate, iglesia, y ponte a brillar,
Que la luz de Cristo ha de iluminar.
Sobre ti su gloria se manifestará,
Y la tierra entera lo reconocerá.

Sal a las naciones con el mensaje fiel,
Proclama que vive el Dios de Israel.
Levántate, iglesia, es tiempo de velar,
Cristo ya viene por su novia a buscar.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Vamos todos a cantar', 'Vamos todos a cantar, vamos todos a alabar,
Al Señor de los señores en este santo lugar.
No te quedes sin cantar, no te quedes sin reír,
Que en el gozo del Señor es hermoso vivir.

Un aplauso para el Rey, una voz de gratitud,
Porque nos dio libertad y perfecta salud.
Vamos todos a cantar, vamos todos a alabar,
Hasta que el templo empiece a vibrar.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es nuestra cabeza', 'Cristo es la cabeza y nosotros el cuerpo,
Unidos en su gracia con un mismo aliento.
Cada miembro colocado en su lugar,
Para edificarnos y el reino ensanchar.

Sostenidos por la fuerza de su salvación,
Caminamos juntos en una misión.
Cristo es la cabeza, el Rey y Señor,
A Él la gloria, la honra y el honor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia triunfante', 'La iglesia de Cristo triunfante será,
Las puertas del hades no prevalecerán.
Fundada en la roca que nunca caerá,
Por los siglos de los siglos firme estará.

Aunque ruja el viento y la tempestad,
Permanece firme en toda verdad.
La iglesia triunfante camina en poder,
Con Cristo Jesús siempre ha de vencer.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Un pueblo que alaba', 'Un pueblo que alaba al Señor,
Es un pueblo que tiene poder.
Las murallas se van a caer,
Cuando el pueblo comienza a alabar.

Cantan los redimidos con fuerza y fervor,
Exaltando el nombre de Cristo el Salvador.
Un pueblo que alaba al Señor,
Es un pueblo vencedor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sirviendo al Señor', 'Servir a Dios no es en vano,
Su recompensa es eterna.
Trabajando de su mano,
Su santa gracia gobierna.

Iré a donde me envíes, Señor de la mies,
Poniendo mi vida completa a tus pies.
Servir al Señor con fidelidad,
Por toda la eternidad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos hermanos', 'Somos hermanos en Cristo Jesús,
Caminando juntos en sendas de luz.
Un mismo Padre nos dio adopción,
Un mismo Espíritu en el corazón.

Si tropiezas, mi mano te levantará,
El amor de Dios nunca fallará.
Somos hermanos de pacto eternal,
Rumbo a la patria celestial.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo nos une', 'Cristo nos une en un solo lazo,
Bajo el abrigo de su fiel abrazo.
Rotos los odios, barrida la queja,
Su amor divino jamás nos aleja.

Un solo bautismo, una sola fe,
Un solo Señor al que adoraré.
Cristo nos une en santa hermandad,
Por su gracia y bondad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Iglesia de Jesucristo', 'Iglesia de Jesucristo, linaje escogido,
Pueblo adquirido para su loor.
Sal de las tinieblas a su luz admirable,
Lleva el mensaje de paz y perdón.

Corona incorruptible te espera en Sion,
Mantén encendido tu fiel corazón.
Iglesia bendita, columna y sostén,
Proclama al Cordero por siempre, amén.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Trabajando para Dios', 'Trabajando en la viña del Señor,
Siembra la palabra con fe y con amor.
Pronto viene el fruto, la siega vendrá,
Y el galardón Cristo te entregará.

No desmayes nunca, obrero de Dios,
Sigue predicando con potente voz.
Trabajando alegres de sol a sol,
Bajo el abrigo del Consolador.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Unidos en oración', 'Unidos en oración, clamando a una voz,
La tierra tiembla ante el gran Dios.
Cadenas se rompen, el preso es libre,
No hay fortaleza que aquí no se derribe.

Como en el aposento alto en Pentecostés,
Postrados oramos todos a sus pies.
Unidos en ferviente clamor,
Desciende la gloria del Señor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos luz del mundo', 'Vosotros sois la luz del mundo,
Una ciudad en un monte no se esconderá.
Brille vuestra luz delante de los hombres,
Para gloria de nuestro Padre celestial.

Que vean tus obras de fe y verdad,
Reflejando el reino de justicia y paz.
Somos luz del mundo en la oscuridad,
Brillando por toda la eternidad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Predicando el evangelio', 'Id por todo el mundo y predicad,
El evangelio de la verdad.
Al cautivo da libertad,
Al quebrantado de corazón sanad.

No me avergüenzo del evangelio,
Poder de Dios para salvación.
Predicando a Cristo con unción,
En cada pueblo, tribu y nación.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay fiesta en la iglesia', 'Hay fiesta en la iglesia hoy,
Porque el Rey de gloria está aquí.
Levanto mis manos al Salvador,
Él me hace cantar y reír.

Gozo inefable, fiesta de poder,
En su presencia no hay que temer.
Hay fiesta en la iglesia hoy,
Damos la gloria a Dios.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La casa de mi Padre', 'Yo me alegré con los que me decían:
A la casa de Jehová iremos.
En sus atrios alabanzas entonaremos,
Y con gratitud nos postraremos.

Mejor es un día en tus atrios, Señor,
Que mil fuera de ellos en gran dolor.
En la casa de mi Padre hay santidad,
Consuelo, gracia y verdad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos pueblo escogido', 'Mas vosotros sois linaje escogido,
Real sacerdocio, nación adquirida.
Para que anunciéis las virtudes santas
De aquel que os trajo a una nueva vida.

Pueblo apartado para el Creador,
Sellados por siempre en su santo amor.
Somos pueblo escogido de Dios,
Oímos su dulce voz.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia de Cristo', 'La iglesia de Cristo no retrocederá,
Firmes en la roca de la verdad.
Aunque los poderes del mal se levanten,
La iglesia del Señor siempre vencerá.

Lavada con sangre, vestida de lino,
Caminando recta por el camino.
La iglesia de Cristo resplandecerá,
Con su Maestro reinará.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Vamos caminando', 'Vamos caminando a la tierra prometida,
Donde fluye leche y miel para la vida.
El maná del cielo nos sustenta cada día,
Y la nube santa es nuestra fiel guía.

No mires atrás a la esclavitud,
Sigue adelante con gran gratitud.
Vamos caminando con paso de vencedor,
Siguiendo las huellas del Salvador.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo viene pronto', 'Cristo viene pronto, velad y orad,
Mantén tu corona y la santidad.
Aceite en tu lámpara debe brillar,
Porque el Esposo no va a tardar.

A la medianoche se oirá el clamor:
¡He aquí el Esposo, salid con honor!
Cristo viene pronto por su remanente,
Alégrate, pueblo creyente.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El pueblo se goza', 'El pueblo de Dios se goza en la alabanza,
En el Señor renueva su esperanza.
Brazos en alto, palmas al compás,
Cristo nos colma de gracia y de paz.

Saltan los montes, se alegran los ríos,
Cuando cantan los escogidos.
El pueblo se goza delante del Rey,
Guardando su santa ley.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Un solo corazón', 'Unánimes juntos en un mismo sentir,
Deseosos de ver su promesa cumplir.
Un solo corazón, una sola alma,
En medio de la prueba tenemos su calma.

Como la iglesia en Jerusalén,
Compartiendo el pan y haciendo el bien.
Un solo corazón en el Señor,
Llenos de gracia y fervor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Sirviendo con amor', 'Sirviendo a los santos con humildad,
Sembrando justicia, verdad y bondad.
Lo que hicisteis al más pequeño de ellos,
A Cristo le disteis con gozo sincero.

Manos extendidas para bendecir,
Pies presurosos para compartir.
Sirviendo con amor en la congregación,
Rindiendo la adoración.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos peregrinos', 'Somos extranjeros y peregrinos aquí,
Nuestra patria eterna está por venir.
Buscamos la patria que tiene cimientos,
Cuyo artífice es Dios en todo momento.

No nos enredamos en lo terrenal,
Miramos la gloria de lo celestial.
Somos peregrinos marchando con fe,
La corona de vida veré.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Marchando hacia Sion', 'Marchando hacia Sion, la hermosa ciudad,
Donde reina Cristo en suma santidad.
Los redimidos entrarán con alegría,
Se acabó la noche, ya despuntó el día.

Calles de oro y mar de cristal,
En el palacio celestial.
Marchando hacia Sion con cántico de loor,
Para ver a nuestro Salvador.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia no se detiene', 'La iglesia no se detiene, continúa su marcha,
Bajo el sol ardiente o la fría escarcha.
Llevando la antorcha del gran avivamiento,
Venciendo la duda y el descontento.

El evangelio no está encadenado,
Por el poder de Dios es respaldado.
La iglesia no se detiene jamás,
Avanza y triunfa en paz.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Unidos venceremos', 'Si estamos unidos, el diablo caerá,
La iglesia unida la victoria tendrá.
Cuerda de tres hilos no se rompe jamás,
En Cristo tenemos victoria y solaz.

Uniendo las manos en intercesión,
Para ver la gloria y la salvación.
Unidos venceremos con nuestro Capitán,
Sus promesas firmes están.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cantemos como hermanos', 'Cantemos como hermanos en cordial comunión,
Elevando a Dios una sola canción.
Que el mundo conozca que somos discípulos,
Si nos amamos de todo corazón.

Fuera la envidia, fuera el rencor,
Reine la paz del consolador.
Cantemos como hermanos en unidad,
Viviendo en santidad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos sus ovejas', 'Pueblo suyo somos y ovejas de su prado,
Por sendas de justicia nos ha guiado.
Junto a aguas de reposo nos pastoreará,
Y nada a nuestras vidas jamás faltará.

Oímos la voz del Pastor eternal,
Nos libra del lobo y de todo mal.
Somos sus ovejas en comunión,
Bajo su santa bendición.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pueblo redimido', 'Pueblo redimido por la sangre de Jesús,
Pueblo que camina en el sendero de la cruz.
Damos testimonio de su santa majestad,
Predicando el reino de justicia y verdad.

No hay condenación para el pueblo de Dios,
Que marcha obediente a su tierna voz.
Pueblo redimido, alza tu loor,
Al Rey y Salvador.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Señor nos llamó', 'El Señor nos llamó de las tinieblas a su luz,
Para proclamar el triunfo de la cruz.
Nos ungió con óleo de gozo y poder,
Para que el cautivo vuelva a renacer.

Heme aquí, envíame a mí, Señor,
Llevaré tu fuego con santo fervor.
El Señor nos llamó a trabajar,
Su nombre a glorificar.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Levantemos nuestras voces', 'Levantemos nuestras voces al Dios de amor,
Tributemos alabanzas a su honor.
Que los cielos oigan nuestra adoración,
Que suba como incienso desde el corazón.

Digno es el Cordero de recibir honor,
Riqueza, sabiduría, fortaleza y loor.
Levantemos nuestras voces sin cesar,
Su nombre a magnificar.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Un pueblo santo', 'Sed santos porque yo soy santo, dice el Señor,
Pueblo lavado en su santo amor.
Sin mancha ni arruga para el día final,
Preparada la novia para el hogar celestial.

Consagrados para servir al Rey,
Andando fieles en su santa grey.
Un pueblo santo caminando en luz,
Siguiendo a Jesús.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La obra del Señor', 'La obra del Señor no se parará,
Con su Espíritu Santo continuará.
No con ejército, ni con espada,
Sino con su palabra derramada.

Adelante, obreros, que el tiempo es veloz,
Oigan el llamado de la fuerte voz.
La obra del Señor florecerá,
Hasta que Él venga triunfará.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Juntos en su presencia', 'Qué bueno y qué delicioso es
Habitar los hermanos juntos en armonía.
Porque allí envía Jehová bendición,
Y vida eterna para el corazón.

Es como el óleo sobre el sacerdote bajando,
La barba y el manto ungido consagrando.
Juntos en su presencia en adoración,
Recibimos su bendición.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi iglesia te alaba', 'Mi iglesia te alaba, Señor de gloria,
Celebrando con júbilo tu victoria.
Reunidos en tu nombre para exaltar,
Las maravillas de tu altar.

No hay otro Dios como tú, Señor,
Grande en misericordia y amor.
Mi iglesia te alaba con devoción,
Desde lo profundo del corazón.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Vamos a trabajar', 'Vamos a trabajar con alegría y fervor,
Llevando el mensaje del gran Salvador.
El grano está maduro, la mies lista está,
El que siembra con lágrimas con gozo segará.

No te canses de orar ni de predicar,
Que las almas perdidas han de regresar.
Vamos a trabajar en la viña del Rey,
Fieles a su santa grey.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos luz y sal', 'Somos sal de la tierra, dando buen sabor,
Testigos vivientes del eterno Salvador.
Somos luz que alumbra en la densidad,
Mostrando a los hombres la santa verdad.

Si la sal se desvanece, ¿con qué se salará?
Mantén tu testimonio que fruto dará.
Somos luz y sal para bendecir,
En Cristo vivir y morir.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo es nuestro Rey', 'Cristo es nuestro Rey, el Soberano Dios,
Toda la congregación escucha su voz.
Rendimos tributo a su majestad,
Reinando en justicia, verdad y equidad.

Alabanza, gloria y honor sin fin,
Canten los coros de arpa y clarín.
Cristo es nuestro Rey y Salvador,
Por siempre su loor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Una iglesia victoriosa', 'Una iglesia victoriosa, una iglesia triunfal,
Que derriba fortalezas del poder infernal.
Con el escudo de la fe y el yelmo de salud,
Marchando al combate con santa actitud.

La espada del Espíritu es la palabra de Dios,
Venciendo las tinieblas a una sola voz.
Una iglesia victoriosa con su Rey,
Cuidando de su grey.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Al servicio del Rey', 'Al servicio del Rey consagrado estoy,
Por la senda de fe caminando voy.
Si me manda al valle o a la cumbre subir,
Mi mayor anhelo es a Cristo servir.

Buenas nuevas de gozo a los pobres daré,
De su fiel providencia testificaré.
Al servicio del Rey con lealtad y amor,
Rindiendo mi vida al Señor.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El pueblo de Dios', 'El pueblo de Dios marcha sin temor,
Protegido en los brazos de su Redentor.
Columna de fuego en la oscuridad,
Columna de nube con fidelidad.

Jehová es nuestro guía, Jehová es la bandera,
Nos lleva a la patria que nos espera.
El pueblo de Dios no retrocederá,
En victoria caminará.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia está viva', 'La iglesia no está muerta, la iglesia está viva,
El fuego del Espíritu la enciende y cautiva.
Poder en los enfermos para sanidad,
Y rotas las cadenas de la cautividad.

Cristo resucitado vive en su corazón,
Derramando los dones y la bendición.
La iglesia está viva, cantando con fe,
Al Cordero alabaré.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En unidad y amor', 'En unidad y amor queremos vivir,
La paz del Señor reflejar y sentir.
Unidos en el vínculo de la caridad,
Caminando juntos en fidelidad.

Que la gloria de Dios llene este lugar,
Cuando nos unimos para adorar.
En unidad y amor hasta el final,
Rumbo al descanso eternal.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Somos adoradores', 'El Padre busca verdaderos adoradores,
Que le adoren en espíritu y verdad.
Dejamos las quejas y los temores,
Rindiendo a sus plantas nuestra voluntad.

Santo, santo, santo es el Gran Señor,
Digno de honra, poder y esplendor.
Somos adoradores de su santidad,
Por toda la eternidad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La misión de Cristo', 'La misión de Cristo es rescatar,
Al perdido y doliente restaurar.
Llevar a los pobres la salvación,
Y derramar sobre todos su bendición.

He aquí mi vida, úsame Señor,
Llevaré tu palabra con fe y fervor.
La misión de Cristo continuaremos,
Y su gloria veremos.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hasta que Cristo venga', 'Hasta que Cristo venga perseveraré,
En la senda gloriosa de la santa fe.
Predicando el mensaje, sirviendo con amor,
Esperando el regreso de mi Salvador.

Ni el desierto ni la prueba me detendrá,
El Espíritu Santo me sostendrá.
Hasta que Cristo venga en majestad,
Viviré en fidelidad.', 10);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuando allá se pase lista', 'Cuando la trompeta suene en aquel día final,
Y el alba eterna rompa en claridad,
Cuando las naciones salvas a su patria lleguen ya,
Y que sea pasada lista, allí he de estar.

Cuando allá se pase lista,
Cuando allá se pase lista,
Cuando allá se pase lista,
A mi nombre yo feliz responderé.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Yo tengo una morada', 'Yo tengo una morada en el reino celestial,
Construida por las manos de mi Salvador triunfal.
No se cansa la vista de tanta hermosura,
Donde nunca jamás entrará la amargura.

Mansión de oro y mar de cristal,
Es el hermoso hogar celestial.
Yo tengo una morada preparada para mí,
Para siempre vivir feliz allí.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pronto veremos al Rey', 'Pronto veremos al Rey en su santa hermosura,
Terminará el dolor y toda la amargura.
En las nubes vendrá con sus santos millares,
Cesará todo llanto y todos los pesares.

¡Maranatha! El Señor pronto viene ya,
Su pueblo redimido con júbilo se irá.
Pronto veremos al Rey en su majestad,
Por toda la eternidad.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Más allá del sol', 'Aunque en esta vida no tenga riquezas,
Sé que allá en la gloria tengo una mansión.
Cual alma perdida entre las pobrezas,
De mí Jesucristo tuvo compasión.

Más allá del sol, más allá del sol,
Yo tengo un hogar, hogar, bello hogar,
Más allá del sol.
Más allá del sol, más allá del sol,
Yo tengo un hogar, hogar, bello hogar,
Más allá del sol.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Voy camino al cielo', 'Voy camino al cielo, voy cantando con unción,
Tengo en Jesucristo mi completa salvación.
Aunque el camino sea angosto y espinoso,
Caminar con Cristo es tan dulce y tan gozoso.

No me detendré, la meta alcanzaré,
Mi corona incorruptible allá recibiré.
Voy camino al cielo tomado de su mano,
Rumbo al hogar cristiano.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo viene pronto', 'Cristo viene pronto, no hay duda en mi ser,
Todas las señales se empiezan a ver.
Guerra, terremotos, angustia y dolor,
Anuncian la venida de nuestro Señor.

Iglesia, prepárate con santidad y luz,
Pronto en los aires veremos a Jesús.
Cristo viene pronto, arrebatamiento habrá,
El pueblo salvo se irá.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hay una tierra prometida', 'Hay una tierra prometida más allá del mar,
Donde los redimidos habrán de morar.
No habrá noche triste ni llanto jamás,
Solo gozo inmenso, alegría y solaz.

Allí fluye el río de agua de vida,
La mesa del Rey ya está servida.
Hay una tierra prometida celestial,
De gozo eternal.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi hogar celestial', 'Mi hogar celestial en la patria de luz,
Ganado en el madero por Cristo Jesús.
Ni oro terrenal, ni tesoro perecedero,
Compara la riqueza del hogar verdadero.

Cantaré con los ángeles en santa devoción,
Entonando por siempre la gran redención.
Mi hogar celestial preparado está,
Mi alma allá descansará.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cuando llegue al cielo', 'Cuando llegue al cielo, qué lindo será,
Ver cara a cara a quien vida me da.
Tocaré sus manos heridas de amor,
Y me postraré rindiendo loor.

No habrá más fatiga, no habrá tentación,
Solo aleluyas de gran corazón.
Cuando llegue al cielo con el Salvador,
Estaré con mi Señor.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Nos veremos en la gloria', 'Nos veremos en la gloria junto al gran trono blanco,
Vestidos de vestiduras de lino y de manto.
Nos daremos el abrazo de eterna victoria,
Cantando sin cesar a Dios en su gloria.

Allí no habrá despedida jamás,
Solamente consuelo, concordia y paz.
Nos veremos en la gloria en santa hermandad,
Por toda la eternidad.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Jerusalén celestial', 'Jerusalén celestial, ciudad de mi Dios,
Doce puertas de perlas oyendo tu voz.
Cimientos de jaspe y muro de zafiro,
Por ver tu belleza contemplo y suspiro.

No necesita sol ni lumbrera lunar,
Porque el Cordero su luz hará brillar.
Jerusalén bendita, patria del Señor,
Morada del vencedor.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Quiero llegar a Sion', 'Quiero llegar a Sion, el monte eternal,
Donde está la morada del Padre celestial.
Con paso seguro marcho sin desmayar,
Peleando la batalla hasta triunfar.

Coronado de gloria por fin me veré,
Al Dios de Jacob siempre alabaré.
Quiero llegar a Sion a descansar,
Y a mi Jesús abrazar.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Allá no habrá tristeza', 'Allá no habrá tristeza, no habrá dolor ni queja,
La gracia de mi Cristo toda sombra aleja.
Dios enjugará toda lágrima ardiente,
Y viviremos juntos con Él eternamente.

No habrá cementerios, no habrá enfermedad,
Solo alabanza en suma santidad.
Allá no habrá tristeza ni tribulación,
Solo gozo y bendición.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Un día nos iremos', 'Un día nos iremos volando a las alturas,
Dejando este mundo de llanto y amarguras.
En un abrir y cerrar de ojos, la trompeta sonará,
Y la iglesia comprada con Cristo volará.

Los muertos en Cristo resucitarán primero,
Y luego nosotros al lado del Cordero.
Un día nos iremos al reino de la luz,
Con nuestro Rey Jesús.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La trompeta sonará', 'La trompeta de Dios con poder sonará,
Y toda la tierra conmovida estará.
El Señor con voz de mando descenderá,
Y su pueblo glorioso a las nubes subirá.

Alégrate, cristiano, levanta tu cabeza,
Que cerca está tu redención con certeza.
La trompeta sonará en cualquier momento,
Para el gran avivamiento.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Esperando al Salvador', 'Esperando al Salvador con fe y oración,
Guardando su palabra en el corazón.
Cual siervo prudente velando de noche,
Sin dar a la carne cabida ni reproche.

Viene en la vigilia que no sospechamos,
Por eso en vigilia fervientes estamos.
Esperando al Salvador con gran lealtad,
Caminando en santidad.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi ciudadanía está en el cielo', 'Mi ciudadanía está en los cielos,
De donde también espero al Salvador.
El cual transformará el cuerpo de humillación,
En cuerpo semejante al de su resurrección.

No pertenezco a la vanidad de este suelo,
Tengo puesta la mira en lo alto del cielo.
Mi ciudadanía está en el reino de Dios,
Obedezco a su voz.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No habrá más llanto', 'Enjugará Dios toda lágrima de los ojos de ellos;
Y ya no habrá muerte, ni habrá más llanto,
Ni clamor, ni dolor; porque las primeras cosas pasaron.
He aquí yo hago nuevas todas las cosas.

Cielos nuevos y tierra nueva contemplaremos,
Y con Cristo en gloria para siempre reinaremos.
No habrá más llanto, tristeza ni gemido,
Para el pueblo redimido.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La gloria venidera', 'Tengo por cierto que las aflicciones presentes
No son comparables con la gloria venidera.
Que en nosotros ha de ser manifestada,
Por la mano de Cristo consumada.

Sufre con gozo, persevera con fe,
Que la corona de vida recibiré.
La gloria venidera superará el dolor,
En la presencia del Señor.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Viene el Rey de gloria', 'Viene el Rey de gloria, alzad vuestras cabezas,
Puertas eternales, dejad las asperezas.
¿Quién es este Rey de gloria celestial?
¡Jehová el fuerte y valiente, el Capitán triunfal!

Con vestiduras teñidas en victoria,
Descenderá coronado de gloria.
Viene el Rey de gloria por su santa grey,
Soberano Rey.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Volverá por su iglesia', 'El mismo Jesús que fue llevado al cielo,
Así vendrá como lo habéis visto ir.
Con voz de arcángel y gran consuelo,
Por su amada iglesia ha de venir.

No nos dejó huérfanos, volverá en verdad,
Para llevarnos a la eternidad.
Volverá por su iglesia sin mancha y sin mancha,
En su victoria ancha.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi corona tendré', 'He peleado la buena batalla de la fe,
He acabado la carrera, la senda guardé.
Por lo demás, me está guardada la corona,
Que el Señor, Juez justo, a los suyos dona.

No solo a mí, mas a todos los que aman
Su gloriosa venida y su nombre claman.
Mi corona tendré al final de la jornada,
Por su gracia alcanzada.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Caminando al cielo', 'Caminando al cielo con gozo y con fe,
En pos del Maestro siempre marcharé.
Aunque ruja el mundo y el diablo se oponga,
No hay quien mi cántico a callar disponga.

Paso a paso sigo al Salvador,
Lleno de su gracia y de su amor.
Caminando al cielo sin mirar atrás,
En su gozo y paz.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El cielo es mi hogar', 'Este mundo no es mi hogar, yo de paso voy,
A las mansiones santas caminando estoy.
Los ángeles me llaman desde el más allá,
Y en este mundo frío mi alma no descansará.

Mi Jesús me espera con brazos de amor,
Para darme descanso del fiero labor.
El cielo es mi hogar, mi patria celestial,
De gozo inmortal.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Allí quiero estar', 'Allí quiero estar, donde los santos cantan,
Donde las arpas de Dios se levantan.
Rodeando el trono del Cordero de Dios,
Alabando su nombre con unida voz.

No habrá sol ni luna que deba alumbrar,
Porque el rostro de Cristo todo va a llenar.
Allí quiero estar en adoración,
Gozando mi salvación.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Un día veremos a Cristo', 'Un día veremos a Cristo bajar en la nube,
Y el corazón lleno de gozo sube.
Veremos sus ojos de llama ardiente,
Y su rostro radiante y resplandeciente.

Caerán los imperios, los reinos caerán,
Mas los santos con Cristo reinarán.
Un día veremos a Cristo en majestad,
Llenos de felicidad.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La promesa del Señor', 'Fiel es el que prometió: no os dejaré,
Vendré otra vez y os tomaré.
Para que donde yo estoy, vosotros también estéis,
Y de mi santa gloria siempre gocéis.

La promesa del Señor firme permanecerá,
Cielo y tierra pasarán, su palabra no pasará.
La promesa del Señor se cumplirá,
Cristo volverá.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Pronto estaremos con Él', 'Pronto estaremos con Él en la gran cena,
Se acabará la angustia, el dolor y la pena.
Nos ceñirá y nos servirá el Señor,
Llenando el alma de su tierno amor.

Gózate y alégrate, hermosa doncella,
Que ya despunta la brillante estrella.
Pronto estaremos con Él en comunión,
En santa bendición.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La nueva Jerusalén', 'Vi descender del cielo, de Dios,
La santa ciudad, la nueva Jerusalén,
Dispuesta como una esposa ataviada
Para su marido y su sumo bien.

He aquí el tabernáculo de Dios con los hombres,
Y morará con ellos sin dolores.
La nueva Jerusalén resplandecerá,
Su gloria brillará.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi esperanza celestial', 'Mi esperanza está puesta en el Señor,
No en la vanidad ni en el oro corruptor.
Sé que mi Redentor vive y al fin se levantará,
Y sobre esta tierra con poder reinará.

Aun deshecha mi carne, a Dios he de ver,
Con ojos de gloria y nuevo ser.
Mi esperanza celestial nunca morirá,
Cristo reinará.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Voy a ver a mi Jesús', 'Voy a ver a mi Jesús cara a cara en Sion,
Recibiendo de sus manos el galardón.
Secará mis lágrimas con tierno consuelo,
Y abrirá las puertas del hermoso cielo.

Todo el sufrimiento aquí se olvidará,
Cuando su mirada en mi ser posará.
Voy a ver a mi Jesús, mi Redentor,
Eterno Salvador.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El Rey ya viene', 'El mercado está vacío, el trabajo terminó,
El sonido del martillo en la tierra ya cesó.
Los labradores han dejado su labor,
Porque ya se acerca el día del Señor.

¡El Rey ya viene, el Rey ya viene!
La trompeta se oye ya resonar.
¡El Rey ya viene, el Rey ya viene!
Gloria a Dios, nos vamos a su hogar.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El día se acerca', 'El día se acerca, la noche ya va a pasar,
Desechemos las obras del mal para no tropezar.
Vistámonos de las armas de la clara luz,
Esperando en las nubes a nuestro Jesús.

No durmamos como otros en la vanidad,
Seamos sobrios andando en santidad.
El día glorioso se acerca ya,
El Señor vendrá.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hasta el día de Cristo', 'El que comenzó la buena obra en vosotros,
La perfeccionará hasta el día de Jesucristo.
No desmayes en la prueba ni en la aflicción,
Él sostiene firme tu corazón.

Guarda el depósito sagrado de fe,
Que con corona de vida me vestiré.
Hasta el día de Cristo perseveraré,
Siempre triunfaré.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La gloria de aquel día', 'No puedo imaginar la gloria de aquel día,
Cuando entremos al cielo con gran alegría.
Millares de ángeles cantando a la vez,
Postrándose humildes a sus santos pies.

Santo, santo, santo es el Salvador,
A Él sea la gloria, imperio y honor.
La gloria de aquel día inundará mi ser,
Para nunca más perecer.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('No quiero perder mi corona', 'Retén lo que tienes, para que ninguno tome tu corona,
Velad en todo tiempo y tu alma abona.
No te desvíes a diestra ni a siniestra,
Sigue la senda que la Biblia muestra.

Aunque arrecie el viento de la tentación,
Mantén el denuedo y la devoción.
No quiero perder mi corona de honor,
Regalo de mi Salvador.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi alma espera', 'Mi alma espera a Jehová
Más que los centinelas a la mañana,
Más que los centinelas a la mañana.
Espera, oh Israel, en Jehová.

Porque en Jehová hay misericordia,
Y abundante redención con Él.
Mi alma espera su santa venida,
Rumbo a la nueva vida.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('En las mansiones celestiales', 'En la casa de mi Padre muchas moradas hay;
Si así no fuera, yo os lo hubiera dicho.
Voy, pues, a preparar lugar para vosotros,
Y vendré otra vez a llevaros conmigo.

En las mansiones celestiales moraré,
Del árbol de la vida allí comeré.
En las mansiones preparadas por amor,
Con mi Redentor.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Allá cantaré victoria', 'Allá cantaré victoria, allá no habrá dolor,
Rodeado de los santos y de su esplendor.
Pondré mi corona a los pies del Cordero,
Agradeciendo su amor tan sincero.

Batalla ganada, carrera corrida,
Por la fe en su nombre alcanzada la vida.
Allá cantaré victoria en alta voz,
Delante de mi Dios.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El encuentro con Jesús', '¡Oh, qué glorioso será el encuentro
En el aire con Cristo Jesús!
Transformados seremos en un momento,
Reflejando su pura y divina luz.

Le veremos tal como Él es, en verdad,
En toda su gloria y majestad.
El encuentro sublime con el Redentor,
Lleno de esplendor.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La trompeta de Dios', 'Porque el Señor mismo con voz de mando,
Con voz de arcángel, y con trompeta de Dios,
Descenderá del cielo; y los muertos en Cristo resucitarán.
Luego nosotros los que vivimos seremos arrebatados.

Juntamente con ellos en las nubes,
Para recibir al Señor en el aire.
La trompeta de Dios estremecerá,
Y la iglesia triunfará.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Cristo viene por mí', 'Cristo viene por mí, yo lo sé muy bien,
Por su gracia comprada en Jerusalén.
Sellado con su Espíritu en el corazón,
Tengo la certeza de mi redención.

Vendrá en las nubes y le veré,
Con cuerpo glorioso me vestiré.
Cristo viene por mí, su iglesia a buscar,
A su eterno hogar.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi hogar no es aquí', 'Mi hogar no es aquí, en la tierra de sombras,
Donde el viento arrastra marchitas las alfombras.
Mi hogar es eterno, mi hogar es de luz,
Fundado en la sangre de Cristo Jesús.

Extranjero y peregrino me considero,
Por la ciudad celeste yo espero.
Mi hogar no es aquí, mi patria está allá,
Donde Dios está.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Esperanza eterna', 'Bendito el Dios y Padre de nuestro Señor Jesucristo,
Que según su grande misericordia nos hizo renacer
Para una esperanza viva, por la resurrección
De Jesucristo de los muertos con poder.

Para una herencia incorruptible, incontaminada,
Inmarcesible, reservada en los cielos para vosotros.
Esperanza eterna que no fallará,
Cristo reinará.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Veremos al Señor', 'Veremos al Señor tal como Él es,
Nos postraremos todos a sus pies.
Contemplaremos las marcas del amor,
Que en la cruz pagaron por el pecador.

No habrá velo que impida la visión,
Será completa nuestra redención.
Veremos al Señor en majestad,
Por la eternidad.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('El gran día llegará', 'El gran día de la redención llegará,
El llanto y el gemido para siempre cesará.
Se abrirán los cielos de par en par,
Y el Rey de la gloria se manifestará.

Pueblo redimido, alza tu cantar,
El tiempo está cerca de coronar.
El gran día de Cristo ya vendrá,
Victoria nos dará.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('La iglesia subirá', 'La iglesia subirá vestida de poder,
Dejando las cadenas que la ataron ayer.
Cual paloma que vuela hacia su palomar,
La esposa de Cristo al cielo ha de entrar.

Con palmas de victoria cantando loor,
Recibida con cantos del divino Creador.
La iglesia subirá a su mansión real,
Al descanso eternal.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Mi Salvador vendrá', 'Mi Salvador vendrá, no tardará su paso,
Rompiendo las cadenas del mortal lazo.
Descenderá con gloria y majestad,
Juzgando a las naciones con equidad.

Alégrate alma mía en esta promesa,
En Cristo se apoya toda mi firmeza.
Mi Salvador vendrá a buscar su grey,
Glorioso y Santo Rey.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Hasta que Él venga', 'Hasta que Él venga anunciaré su muerte,
Celebrando en victoria su gracia fuerte.
Partiendo el pan y bebiendo la copa,
Mientras su amor celestial nos arropará.

Hasta que Él venga velaré en oración,
Guardando encendida la adoración.
Hasta que Él venga en gloria y poder,
Fiel he de ser.', 11);
INSERT OR IGNORE INTO choruses (title, lyrics, category_id) VALUES ('Por siempre con Jesús', 'Por siempre con Jesús en la gloria estaré,
Por la eternidad a su nombre cantaré.
Ya no habrá noche, ni sol, ni calor,
Solo la luz del eterno Creador.

Río de agua viva, trono de santidad,
Gozando de su plena y perfecta bondad.
Por siempre con Jesús, amén, aleluya,
La gloria sea tuya.', 11);

-- Reconstruir índice de búsqueda Full-Text Search FTS5
INSERT INTO choruses_fts(choruses_fts) VALUES('rebuild');
