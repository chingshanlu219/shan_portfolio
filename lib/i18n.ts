export type Language = "zh-TW" | "zh-CN" | "en" | "fr" | "es";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "zh-TW", label: "繁中" },
  { code: "zh-CN", label: "簡中" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export interface Translations {
  nav: {
    homepage: string;
    project: string;
    sketch: string;
    photography: string;
    admin: string;
  };
  homepage: {
    viewAllProjects: string;
    viewAllSketches: string;
  };
  project: {
    title: string;
    description: string;
    backToList: string;
  };
  sketch: {
    title: string;
    description: string;
    backToList: string;
  };
  photography: {
    title: string;
    description: string;
    backToList: string;
  };
  footer: {
    copyright: string;
  };
  common: {
    loading: string;
    error: string;
  };
}

export const translations: Record<Language, Translations> = {
  "zh-TW": {
    nav: { homepage: "首頁", project: "作品", sketch: "草圖", photography: "攝影", admin: "管理" },
    homepage: { viewAllProjects: "查看全部作品", viewAllSketches: "查看全部草圖" },
    project: { title: "作品", description: "作品集", backToList: "← 返回作品列表" },
    sketch: { title: "草圖", description: "草圖集", backToList: "← 返回草圖列表" },
    photography: { title: "攝影", description: "攝影作品", backToList: "← 返回攝影列表" },
    footer: { copyright: "© 版權所有" },
    common: { loading: "載入中...", error: "發生錯誤" },
  },
  "zh-CN": {
    nav: { homepage: "首页", project: "作品", sketch: "草图", photography: "摄影", admin: "管理" },
    homepage: { viewAllProjects: "查看全部作品", viewAllSketches: "查看全部草图" },
    project: { title: "作品", description: "作品集", backToList: "← 返回作品列表" },
    sketch: { title: "草图", description: "草图集", backToList: "← 返回草图列表" },
    photography: { title: "摄影", description: "摄影作品", backToList: "← 返回摄影列表" },
    footer: { copyright: "© 版权所有" },
    common: { loading: "加载中...", error: "发生错误" },
  },
  en: {
    nav: { homepage: "Homepage", project: "Project", sketch: "Sketch", photography: "Photography", admin: "Admin" },
    homepage: { viewAllProjects: "View All Projects", viewAllSketches: "View All Sketches" },
    project: { title: "Project", description: "Projects", backToList: "← Back to Projects" },
    sketch: { title: "Sketch", description: "Sketches", backToList: "← Back to Sketches" },
    photography: { title: "Photography", description: "Photography", backToList: "← Back to Photography" },
    footer: { copyright: "© All rights reserved" },
    common: { loading: "Loading...", error: "An error occurred" },
  },
  fr: {
    nav: { homepage: "Accueil", project: "Projet", sketch: "Croquis", photography: "Photographie", admin: "Admin" },
    homepage: { viewAllProjects: "Voir tous les projets", viewAllSketches: "Voir tous les croquis" },
    project: { title: "Projet", description: "Projets", backToList: "← Retour aux projets" },
    sketch: { title: "Croquis", description: "Croquis", backToList: "← Retour aux croquis" },
    photography: { title: "Photographie", description: "Photographie", backToList: "← Retour à la photographie" },
    footer: { copyright: "© Tous droits réservés" },
    common: { loading: "Chargement...", error: "Une erreur s'est produite" },
  },
  es: {
    nav: { homepage: "Inicio", project: "Proyecto", sketch: "Boceto", photography: "Fotografía", admin: "Admin" },
    homepage: { viewAllProjects: "Ver todos los proyectos", viewAllSketches: "Ver todos los bocetos" },
    project: { title: "Proyecto", description: "Proyectos", backToList: "← Volver a proyectos" },
    sketch: { title: "Boceto", description: "Bocetos", backToList: "← Volver a bocetos" },
    photography: { title: "Fotografía", description: "Fotografía", backToList: "← Volver a fotografía" },
    footer: { copyright: "© Todos los derechos reservados" },
    common: { loading: "Cargando...", error: "Ocurrió un error" },
  },
};
