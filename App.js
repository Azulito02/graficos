import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import GraficoSalarios from './src/components/GraficoSalarios';
import GraficoGeneros from './src/components/GraficoGeneros';
import GraficoReporteEnfermedades from './src/components/GraficoReporteEnfermedades';
import GraficoBezier from './src/components/GraficoBezier';
import { collection, getDocs, query } from 'firebase/firestore';
import GraficoProgreso from './src/components/GraficoProgreso';

import db from './src/database/firebaseconfig';

export default function Graficos() {
  const [bandera, setBandera] = useState(false); // Variable bandera
  const [dataSalarios, setDataSalarios] = useState({
    labels: [''],
    datasets: [{ data: [0] }]
  });
  const [dataGeneros, setDataGeneros] = useState([]); // Para almacenar datos de géneros
  const [dataProgreso, setDataProgreso] = useState({
    labels: ['Hombres', 'Mujeres'],
    data: [0, 0]
  });

  const dataReporteEnfermedades = [
    { date: "2017-01-05", count: 8 }, 
    { date: "2017-01-19", count: 5 }, 
    { date: "2017-02-06", count: 2 }, 
    { date: "2017-02-20", count: 4 }, 
    { date: "2017-03-07", count: 1 }, 
    { date: "2017-03-21", count: 3 }, 
    { date: "2017-04-05", count: 6 }, 
    { date: "2017-04-19", count: 2 }, 
    { date: "2017-05-03", count: 4 },
    { date: "2017-05-17", count: 7 },
    { date: "2017-06-06", count: 9 }, 
    { date: "2017-06-20", count: 5 }, 
    { date: "2017-07-05", count: 3 }, 
    { date: "2017-07-19", count: 4 }, 
    { date: "2017-08-07", count: 2 },  
    { date: "2017-08-21", count: 8 },  
    { date: "2017-09-06", count: 3 },
    { date: "2017-09-20", count: 7 },
    { date: "2017-10-04", count: 5 },
    { date: "2017-10-18", count: 6 },
    { date: "2017-11-06", count: 2 },
    { date: "2017-11-20", count: 9 }, 
    { date: "2017-12-05", count: 4 },
    { date: "2017-12-19", count: 7 } 
  ];
  
  // Carga de datos de salarios
  useEffect(() => {
    const recibirDatosSalarios = async () => {
      try {
        const q = query(collection(db, "personas"));
        const querySnapshot = await getDocs(q);
        const nombres = [];
        const salarios = [];

        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { nombre, salario } = datosBD;
          nombres.push(nombre);
          salarios.push(salario);
        });

        setDataSalarios({
          labels: nombres,
          datasets: [{ data: salarios }]
        });

        console.log({ labels: nombres, datasets: [{ data: salarios }] });
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosSalarios();
  }, [bandera]);

  // Carga de datos de géneros
  useEffect(() => {
    const recibirDatosGeneros = async () => {
      try {
        const q = query(collection(db, "personas"));
        const querySnapshot = await getDocs(q);
        let masculino = 0;
        let femenino = 0;

        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { genero } = datosBD;

          if (genero === "Masculino") {
            masculino += 1;
          } else if (genero === "Femenino") {
            femenino += 1;
          }
        });

        const totalData = [
          {
            name: "Masculino",
            population: masculino,
            color: "rgba(131, 167, 234, 0.5)",  // Azul con 50% de intensidad
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          },
          {
            name: "Femenino",
            population: femenino,
            color: "rgba(255, 105, 180, 0.5)",  // Rosa con 50% de intensidad
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          }
        ];

        setDataGeneros(totalData);
        console.log(totalData);
        
        // Actualiza los datos de progreso
        const totalPersonas = masculino + femenino;
        const progresos = totalPersonas > 0 ? [masculino / totalPersonas, femenino / totalPersonas] : [0, 0];
        
        setDataProgreso({
          labels: ['Hombres', 'Mujeres'],
          data: progresos
        });
        
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosGeneros();
  }, [bandera]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* <Formulario setBandera={setBandera}/> */}
        <GraficoSalarios dataSalarios={dataSalarios} />
        <GraficoBezier dataSalarios={dataSalarios} />
        <GraficoGeneros dataGeneros={dataGeneros} />
        <GraficoReporteEnfermedades dataReporteEnfermedades={dataReporteEnfermedades} />
        <GraficoProgreso 
          dataProgreso={dataProgreso}
          colors={['rgba(131, 167, 234, 0.5)', 'rgba(255, 105, 180, 0.5)']}   
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 10,
  },
  graphContainer: {
    marginTop: 10,
    padding: 10,
  },
});
